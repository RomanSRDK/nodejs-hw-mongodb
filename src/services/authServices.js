import { UsersCollection } from '../models/usersSchema.js';

const registerUser = async (payload) => {
  const user = await UsersCollection.create(payload);
  return user;
};

export { registerUser };
