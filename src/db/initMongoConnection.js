import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { getEnvVar } from '../utils/getEnvVar.js';

dotenv.config({
  quiet: true,
});

export const initMongoDB = async () => {
  try {
    const user = getEnvVar('MONGODB_USER');
    const pwd = getEnvVar('MONGODB_PASSWORD');
    const url = getEnvVar('MONGODB_URL');
    const db = getEnvVar('MONGODB_DB');

    await mongoose.connect(
      `mongodb+srv://${user}:${pwd}@${url}/${db}?appName=Cluster0&retryWrites=true&w=majority`,
    );
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Error connecting to MongoDB!', error);
    process.exit(1);
  }
};
