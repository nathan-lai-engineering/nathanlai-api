import { db, guilds, guildModules } from '#db';
import { eq, isNull } from 'drizzle-orm';

const getSchema = {
  tags: ['discord-guilds'],
  summary: 'Get all guild data',
  description: 'Gets all Guild data including status of modules.',
  security: [{ apiKeyAuth: [] }],
  response: {
    200: {
      description: 'All guilds by guild ID, with their enabled modules',
      type: 'object',
      additionalProperties: {
        type: 'object',
        properties: {
          createdAt: { type: 'string', format: 'date-time' },
          modules: { type: 'array', items: { type: 'string' } },
        },
      },
    },
    401: {
      description: 'Missing or invalid x-api-key',
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
};

export default async function (fastify) {
  fastify.get('/', { schema: getSchema }, async (request, reply) => {

    // get all guilds and enabled modules
    const rows = await db.select({
        guildId: guilds.guildId,
        createdAt: guilds.createdAt,
        moduleName: guildModules.moduleName,
        enabled: isNull(guildModules.deletedAt),
      })
      .from(guilds)
      .leftJoin(guildModules, eq(guilds.guildId, guildModules.guildId));

    // build response object to group rows by guildid
    const guildResponse = {};
    rows.forEach(row => {
      const guildId = row.guildId;
      if (!(guildId in guildResponse)) {
        guildResponse[guildId] = { createdAt: row.createdAt, modules: [] };
      }
      if (row.moduleName && row.enabled) {
        guildResponse[guildId].modules.push(row.moduleName);
      }
    });

    return guildResponse;
  });
}
