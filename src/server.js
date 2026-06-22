import { getEnvVar } from './utils/getEnvVar';
import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

const PORT = Number(getEnvVar('PORT', '3000'));

export const startServer = () => {
  const app = express();

  //MIDDLEWARE
  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  //MIDDLEWARE

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello World!',
    });
  });

  //MIDDLEWARE
  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });
  //MIDDLEWARE

  app.listen(PORT);
};
