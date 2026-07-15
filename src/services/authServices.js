import bcrypt from 'bcrypt';
import { randomBytes } from 'node:crypto';
import createHttpError from 'http-errors';
import { UsersCollection } from '../models/usersSchema.js';
import { SessionsCollection } from '../models/sessionsSchema.js';
import {
  FIFTEEN_MINUTES,
  THIRTY_DAYS,
  SMTP,
  TEMPLATES_DIR,
} from '../constants/constants.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/sendMail.js';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

const registerUser = async ({ name, email, password }) => {
  if (await UsersCollection.findOne({ email })) {
    throw createHttpError(409, 'Email in use');
  }

  return await UsersCollection.create({
    name,
    email,
    password: await bcrypt.hash(password, 10),
  });
};

const loginUser = async ({ email, password }) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password is incorrect');
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    throw createHttpError(401, 'Email or password is incorrect');
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  return await SessionsCollection.create({
    userId: user._id,
    ...createSession(),
  });
};

const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession();

  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const resetToken = jwt.sign(
    {
      // информация, которую мы хотим положить внутрь токена
      sub: user._id,
      email,
    },
    // Второй аргумент - секретный ключ
    getEnvVar('JWT_SECRET'),
    {
      // срок жизни токена
      expiresIn: '5m',
    },
  );

  // Находим HTML-шаблон письма
  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  // Читаем этот файл
  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  // Компилируем шаблон
  const template = handlebars.compile(templateSource);

  // Подставляем реальные значения
  const html = template({
    name: user.name,
    link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: getEnvVar(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await UsersCollection.findOne({
    _id: entries.sub,
    email: entries.email,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );

  await SessionsCollection.deleteMany({ userId: user._id });
};

const generateToken = () => randomBytes(30).toString('base64');
function createSession() {
  const now = Date.now();

  return {
    accessToken: generateToken(),
    refreshToken: generateToken(),
    accessTokenValidUntil: new Date(now + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(now + THIRTY_DAYS),
  };
}

export {
  registerUser,
  loginUser,
  refreshUsersSession,
  logoutUser,
  requestResetToken,
  resetPassword,
};
