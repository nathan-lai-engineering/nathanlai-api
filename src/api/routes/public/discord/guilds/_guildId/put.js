import { db, guilds, guildModules, modules } from '#db';
import { sql } from 'drizzle-orm';

const getSchema = {
  tags: ['discord-guilds'],
  summary: 'Inserts a Guild',
  description: 'Inserts a new Guild if not existing, otherwise re-enables it.',
  security: [{ apiKeyAuth: [] }],
  params: {
    type: 'object',
    properties: {
      guildId: { type: 'string', description: 'Guild snowflake', pattern: '^[0-9]{19}$' },
    },
    required: ['guildId'],
    additionalProperties: false,
  },
  response: {
    200: {
      description: 'The Guild ID after the write and date of last update.',
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild snowflake' },
        updatedAt: { type: 'string', format: 'date-time', description: 'When this guild was last updated' },
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
  fastify.put('/', { schema: getSchema }, async (request, reply) => {
    const guildId = request.params.guildId;

    const insertedGuild = await db.transaction(async (tx) => {

      // insert on the guild id. if already existing, ensure it is enabled.
      const [guild] = await tx.insert(guilds)
        .values({ guildId })
        .onConflictDoUpdate({
          target: guilds.guildId,
          set: {
            deletedAt: null,
            updatedAt: sql`now()`,
          },
        })
        .returning({
          guildId: guilds.guildId,
          updatedAt: guilds.updatedAt,
        });

      // prefills guild_modules with disabled entries
      // existing guild_modules are untouched
      await tx.insert(guildModules)
        .select(
          tx.select({
            moduleName: modules.name,
            guildId: sql`${guildId}`.as('guild_id'),
            deleted_at: sql`now()`,
          }).from(modules)
        )
        .onConflictDoNothing();

      return guild;
    });

    return insertedGuild;
  });
}
