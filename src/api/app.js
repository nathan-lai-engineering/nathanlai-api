import Fastify from 'fastify';
import actionLogsRoutes from './routes/actionLogs.js';

export function buildApp() {

  return; // temporarily closed in prod
  const app = Fastify({ logger: true });

  app.register(actionLogsRoutes);

  return app;
}
