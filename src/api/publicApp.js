/**
 * public fastify endpoints
 * exposed to outside network
 * requires rate limiting + cloudflare security
 */
import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';

// absolute ceiling across ALL clients combined, on top of per-IP limiting below
// protects against botnets that spread requests across many IPs to dodge per-IP caps
const GLOBAL_MAX_REQUESTS = 2000;
const GLOBAL_WINDOW_MS = 60_000;

export function buildPublicApp(){
    const app = Fastify({ logger: true });

    app.register(helmet);

    app.register(rateLimit, {
        max: 100,
        timeWindow: '1 minute',
    });

    let globalCount = 0;
    setInterval(() => { globalCount = 0; }, GLOBAL_WINDOW_MS).unref();

    app.addHook('onRequest', (_request, reply, done) => {
        globalCount++;
        if (globalCount > GLOBAL_MAX_REQUESTS) {
            reply.code(503).send({ error: 'Server is under heavy load, please wait a full minute and try again.' });
            return;
        }
        done();
    });

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