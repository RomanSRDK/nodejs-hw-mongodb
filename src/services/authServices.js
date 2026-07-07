import bcrypt from 'bcrypt';
import { randomBytes } from 'node:crypto';
import createHttpError from 'http-errors';
import { UsersCollection } from '../models/usersSchema.js';
import { SessionsCollection } from '../models/sessionsSchema.js';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/authConstants.js';

const registerUser = async (payload) => {
  const { name, email, password } = payload;

  if (await UsersCollection.findOne({ email })) {
    throw createHttpError(409, 'Email in use');
  }

  return await UsersCollection.create({
    name,
    email,
    password: await bcrypt.hash(password, 10),
  });
};

const loginUser = async (payload) => {
  const { email, password } = payload;

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

  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionsCollection.create({
    userId: session.userId,
    ...createSession(),
  });
};

const logoutUser = async ({ sessionId, refreshToken }) => {
  await SessionsCollection.deleteOne({
    _id: sessionId,
    refreshToken,
  });
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

export { registerUser, loginUser, logoutUser, refreshUsersSession };
