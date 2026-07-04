import createHttpError from 'http-errors';
import { SessionsCollection } from '../models/sessionsSchema.js';
import { UsersCollection } from '../models/usersSchema.js';

export const authenticate = async (req, res, next) => {
  // const authHeader = req.headers.authorization;
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    throw createHttpError(401, 'Please provide Authorization header');
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    throw createHttpError(401, 'Auth header should be of type Bearer');
  }

  const session = await SessionsCollection.findOne({ accessToken: token });

  if (!session) {
    throw createHttpError(401, 'Invalid access token');
  }

  if (new Date() > session.accessTokenValidUntil) {
    throw createHttpError(401, 'Access token expired');
  }

  const user = await UsersCollection.findById(session.userId);

  if (!user) {
    throw createHttpError(401, 'User not found');
  }

  req.user = user;

  next();
};
