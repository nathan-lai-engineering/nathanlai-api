import { db, riotAccountsInRiot } from '#db';
import { eq, and, sql } from 'drizzle-orm';

const getSchema = {
  tags: ['riot-accounts'],
  summary: 'Soft-deletes a Riot account',
  description: 'Soft-deletes a Riot account by setting deleted_at. A Discord account may have many Riot accounts; this only removes the one identified by riotId/riotTag.',
  security: [{ apiKeyAuth: [] }],
  params: {
    type: 'object',
    properties: {
      riotId: { type: 'string', description: 'Riot ID (name portion)', maxLength: 16 },
      riotTag: { type: 'string', description: 'Riot tag (#suffix)', maxLength: 5 },
    },
    required: ['riotId', 'riotTag'],
    additionalProperties: false,
  },
  response: {
  },
};

export default async function (fastify) {
  fastify.delete('/', { schema: getSchema }, async (request, reply) => {
  });
}
