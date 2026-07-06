import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/constants.js';
import { initMongoDB } from './db/initMongoConnection.js';
import { startServer } from './server.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';

// (async () => {
//   await initMongoDB();
//   startServer();
// })();

const bootstrap = async () => {
  await initMongoDB();
  await createDirIfNotExists(TEMP_UPLOAD_DIR);
  await createDirIfNotExists(UPLOAD_DIR);
  startServer();
};

void bootstrap();
