/**
 * builds private fastify server for internal usage on the node
 * does not contain any rate limiting
 * should not be connected to outside network
 */

import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import autoload from '@fastify/autoload';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

// note, because this is intended to be internal only without public access,
// you will need to use a tunnel to access this
// refer to infra for any tunnel scripts

// reconstruction for commonjs convention
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function buildPrivateApp() {

  const app = Fastify({ logger: true });

  app.register(swagger, {
    openapi: {
      info: {
        title: 'Nathan Lai private, internal API endpoints',
        version: '1.0.0',
      },
    },
  });

  app.register(swaggerUi, {
    routePrefix: '/docs',
  });

  // dynamic loading of of routes/private
  app.register(autoload, {
    dir: path.join(__dirname, 'routes', 'private'),
  });

  return app;
}
