/**
 * builds private fastify server for internal usage on the node
 * does not contain any rate limiting
 * should not be connected to outside network
 */

import Fastify from 'fastify';
import actionLogsRoutes from './routes/private/actionLogs.js';

export function buildPrivateApp() {

  const app = Fastify({ logger: true });

  app.register(actionLogsRoutes);

  return app;
}
