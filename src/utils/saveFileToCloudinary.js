import { v2 as cloudinary } from 'cloudinary';
import fs from 'node:fs/promises';
import { getEnvVar } from './getEnvVar.js';
import { CLOUDINARY } from '../constants/constants.js';

cloudinary.config({
  cloud_name: getEnvVar(CLOUDINARY.CLOUD_NAME),
  api_key: getEnvVar(CLOUDINARY.API_KEY),
  api_secret: getEnvVar(CLOUDINARY.API_SECRET),
});

export const saveFileToCloudinary = async (file) => {
  try {
    const response = await cloudinary.uploader.upload(file.path);
    return response.secure_url;
  } finally {
    await fs.unlink(file.path).catch(() => {});
  }
};
