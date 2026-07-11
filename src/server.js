import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
// import pino from 'pino-http';
import { getEnvVar } from './utils/getEnvVar.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { router } from './routes/index.js';
import cookieParser from 'cookie-parser';
import { UPLOAD_DIR } from './constants/constants.js';

export const startServer = () => {
  const PORT = Number(getEnvVar('PORT', '3000'));
  const app = express();

  // use() — это "подключить".
  app.use(helmet());
  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());
  // app.use(
  //   pino({
  //     transport: {
  //       target: 'pino-pretty',
  //     },
  //   }),
  // );
  app.use(express.static(UPLOAD_DIR));
  app.use(router);
  app.use(notFoundHandler); //если ничего не найдено
  app.use(errorHandler); //если где-то произошла ошибка

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
