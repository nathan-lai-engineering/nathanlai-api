import { db, apiClientKeys } from '#db';
import { sql, and, eq, isNull} from 'drizzle-orm';import crypto from 'node:crypto';

export default async function (fastify, opts) {
  fastify.addHook('onRequest', async (request, reply) => {
    const key = request.headers['x-api-key'];
    if (!key) {
      reply.code(401).send({ error: 'Missing x-api-key' });
      return;
    }
    const hash = crypto.createHash('sha256').update(key).digest('hex');

    // check if api key hash exists in db and is still valid
    const [client] = await db.select({ id: apiClientKeys.id })
      .from(apiClientKeys)
      .where(and(eq(apiClientKeys.apiKeyHash, hash), isNull(apiClientKeys.deletedAt)))
      .limit(1);

    if (!client) {
      reply.code(401).send({ error: 'Invalid API key' });
      return;
    }

    await db.update(apiClientKeys)
      .set({lastUsedAt: sql`now()`})
      .where(eq(apiClientKeys.apiKeyHash, hash))
      
  });
}