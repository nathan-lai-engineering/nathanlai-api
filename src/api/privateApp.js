/**
 * builds private fastify server for internal usage on the node
 * does not contain any rate limiting
 * should not be connected to outside network
 */

import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import actionLogsRoutes from './routes/private/actionLogs.js';

export function buildPrivateApp() {

  const app = Fastify({ logger: true });

  app.register(swagger, {
    openapi: {
      info: {
        title: 'Nathan Lai private API endpoints',
        version: '1.0.0',
      },
    },
  });

  app.register(swaggerUi, {
    routePrefix: '/docs',
  });

  app.register(actionLogsRoutes);

  return app;
}
