import { setupServer } from './server.js';
import { initMongoDB } from './db/initMongoConnection.js';

(async () => {
  await initMongoDB();
  setupServer();
})();

// const bootstrap = async () => {
//   await initMongoDB();
//   setupServer();
// };
// bootstrap();
