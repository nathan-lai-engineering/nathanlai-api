import { buildPrivateApp } from './privateApp.js';
import { buildPublicApp } from './publicApp.js';


const privateApp = buildPrivateApp();
privateApp.listen({ port: 3001, host: '0.0.0.0' }, (err) => {
  if (err) {
    privateApp.log.error(err);
    process.exit(1);
  }
});

const publicApp = buildPublicApp();
publicApp.listen({ port: 3000, host: '0.0.0.0' }, (err) => {
  if (err) {
    publicApp.log.error(err);
    process.exit(1);
  }
});