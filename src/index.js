import { startServer } from './server.js';
import { initMongoDB } from './db/initMongoConnection.js';

(async () => {
  await initMongoDB();
  startServer();
})();

// const bootstrap = async () => {
//   await initMongoDB();
//   setupServer();
// };
// bootstrap();
