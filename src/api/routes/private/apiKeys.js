import { db, apiKeys } from '#db';
import { eq } from 'drizzle-orm';

const getApiKeySchema = {
  querystring: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'The api_keys.source value to look up' },
    },
    required: ['name'],
  },
};

export default async function apiKeysRoutes(fastify) {
  fastify.get('/api_key', { schema: getApiKeySchema }, async (request) => {
    const { name } = request.query;
    const normalizedName = name.trim().toLowerCase();

    const [row] = await db.select({
        keyString: apiKeys.keyString,
      })
      .from(apiKeys)
      .where(eq(apiKeys.source, normalizedName))
      .limit(1);

    return row?.keyString ?? null;
  });
}
