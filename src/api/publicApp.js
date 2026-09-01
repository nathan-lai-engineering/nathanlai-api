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
import { config } from '#config';
import autoload from '@fastify/autoload';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import { db, apiClients } from '#db';
import { and, eq, isNull, sql } from 'drizzle-orm';

const gatedRoutes = ['/discord', '/logs'];
const gatedMethods = new Set(['PUT', 'DELETE']);

// reconstruction for commonjs convention
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function buildPublicApp(){
    const app = Fastify({ logger: true });

    app.register(helmet);

    app.register(rateLimit, {
        max: 100,
        timeWindow: '1 minute',
    });

    // absolute ceiling across ALL clients combined, on top of per-IP limiting below
    // protects against botnets that spread requests across many IPs to dodge per-IP caps
    let globalCount = 0;
    setInterval(() => { globalCount = 0; }, config.apiGlobalMaxWindow).unref();
    app.addHook('onRequest', (_request, reply, done) => {
        globalCount++;
        if (globalCount > config.apiGlobalMaxRequests) {
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
        tags: [
            {name: 'discord-accounts', description: 'For usage by personal discord bot. Requires api key.'},
            {name: 'discord-guilds', description: 'For usage by personal discord bot. Requires api key.'},
            {name: 'discord-channels', description: 'For usage by personal discord bot. Requires api key.'},
            {name: 'riot', description: 'Riot Games related usage'},
            {name: 'logs', description: 'All logs for API and other automations'},
        ],
        components: {
            securitySchemes: {
                apiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-api-key',
                },
            },
        },
        },
    });

    app.register(swaggerUi, {
        routePrefix: '/docs',
    });

    app.addHook('onRequest', async (request, reply) => {
        const needsAuth = gatedMethods.has(request.method) || gatedRoutes.some((prefix) => request.url.startsWith(prefix));
        if(!needsAuth) return;

        // hash key if exists
        const key = request.headers['x-api-key'];
        if (!key) {
            reply.code(401).send({ error: 'Missing x-api-key' });
            return;
        }
        const hash = crypto.createHash('sha256').update(key).digest('hex');

        // check if api key hash exists in db and is still valid
        const [client] = await db.select({ id: apiClients.id })
        .from(apiClients)
        .where(and(eq(apiClients.apiKeyHash, hash), isNull(apiClients.deletedAt)))
        .limit(1);

        // invalid hash
        if (!client) {
        reply.code(401).send({ error: 'Invalid API key' });
        return;
        }

        // update last used 
        await db.update(apiClients)
            .set({lastUsedAt: sql`now()`})
            .where(eq(apiClients.apiKeyHash, hash))
        });

    // dynamic loading of routes/public
    app.register(autoload, {
        dir: path.join(__dirname, 'routes', 'public'),
        routeParams: true
    });

    return app;
}