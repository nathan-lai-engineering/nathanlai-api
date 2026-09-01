import { db, discordAccounts} from '#db';
import { sql } from 'drizzle-orm';

const getSchema = {
  tags: ['discord-accounts'],
  security: [{ apiKeyAuth: [] }],
  params: {
    type: 'object',
    properties: {
      discordId: { type: 'string', description: 'Discord snowflake' },
    },
    required: ['discordId'],
  },
  body: {
    type: 'object',
    properties: {
      birthMonth: { type: 'integer', description: 'The month (1-12) user was born' },
      birthDay: { type: 'integer', description: 'The day of the month (1-31) user was born'}
    },
    required: [],
  },
};

export default async function (fastify) {
  fastify.put('/', { schema: getSchema }, async (request, reply) => {
    const discordId = request.params.discordId;
    const birthMonth = request.body.birthMonth ?? null;
    const birthDay = request.body.birthDay ?? null ;

    const [insertedAccount] = await db.insert(discordAccounts)
      .values({
        discordId,
        birthMonth: birthMonth,
        birthDay: birthDay,
      })
      .onConflictDoUpdate({
        target: discordAccounts.discordId,
        set: {
          birthMonth: sql`COALESCE(${birthMonth}, ${discordAccounts.birthMonth})`,
          birthDay: sql`COALESCE(${birthDay}, ${discordAccounts.birthDay})`,
          updatedAt: sql`now()`,
        },
      })
      .returning({
        discordId: discordAccounts.discordId,
        birthMonth: discordAccounts.birthMonth,
        birthDay: discordAccounts.birthDay,
        updatedAt: discordAccounts.updatedAt,
      });

      return insertedAccount;
  });
}
