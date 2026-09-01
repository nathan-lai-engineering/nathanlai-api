import { db, externalServiceKeys } from '#db';
import { eq } from 'drizzle-orm';

const getApiKeySchema = {
  querystring: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'The external_service_keys.source value to look up' },
    },
    required: ['name'],
  },
};

export default async function externalServiceKeysRoutes(fastify) {
  fastify.get('/api_key', { schema: getApiKeySchema }, async (request) => {
    const { name } = request.query;
    const normalizedName = name.trim().toLowerCase();

    const [row] = await db.select({
        keyString: externalServiceKeys.keyString,
      })
      .from(externalServiceKeys)
      .where(eq(externalServiceKeys.source, normalizedName))
      .limit(1);

    return row?.keyString ?? null;
  });
}
