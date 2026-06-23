import dotenv from 'dotenv';

dotenv.config({
  quiet: true,
});

export function getEnvVar(name, defaultValue) {
  const value = process.env[name] ?? defaultValue;

  if (value === undefined) {
    throw new Error(`Missing: process.env['${name}'].`);
  }

  return value;
}
