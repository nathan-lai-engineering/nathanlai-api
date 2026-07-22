/**
 * public fastify endpoints
 * exposed to outside network
 * requires rate limiting + cloudflare security
 */
import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

export function buildPublicApp(){
    const app = Fastify({ logger: true });

    app.register(swagger, {
        openapi: {
        info: {
            title: 'Nathan Lai public API endpoints',
            version: '1.0.0',
        },
        },
    });

        app.register(swaggerUi, {
        routePrefix: '/docs',
    });

    return app;
}