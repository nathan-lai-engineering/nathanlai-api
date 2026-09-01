import { db, discordAccounts} from '#db';
import { sql } from 'drizzle-orm';

const getSchema = {
  tags: ['discord-accounts'],
  summary: 'Upserts a Discord account',
  description: 'Upserts values stored at the Discord account level. Unspecified fields are left unchanged.',
  security: [{ apiKeyAuth: [] }],
  params: {
    type: 'object',
    properties: {
      discordId: { type: 'string', description: 'Discord snowflake', pattern: '^[0-9]{17,20}$' },
    },
    required: ['discordId'],
    additionalProperties: false,
  },
  body: {
    type: 'object',
    properties: {
      birthMonth: { type: 'integer', description: 'The month (1-12) user was born', minimum: 1, maximum: 12, example: 6 },
      birthDay: { type: 'integer', description: 'The day of the month (1-31) user was born', minimum: 1, maximum: 31, example: 15 }
    },
    required: [],
    minProperties: 1,
    additionalProperties: false,
  },
  response: {
    200: {
      description: 'The discord account after the write, reflecting any fields left unchanged',
      type: 'object',
      properties: {
        discordId: { type: 'string', description: 'Discord snowflake' },
        birthMonth: { type: ['integer', 'null'], description: 'The month (1-12) user was born' },
        birthDay: { type: ['integer', 'null'], description: 'The day of the month (1-31) user was born' },
        updatedAt: { type: 'string', format: 'date-time', description: 'When this account was last updated' },
      },
    },
    400: {
      description: 'Body is invalid (empty body or field is outside the allowed range)',
      type: 'object',
      properties: {
        statusCode: { type: 'integer' },
        error: { type: 'string' },
        message: { type: 'string' },
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
    const discordId = request.params.discordId;
    const birthMonth = request.body.birthMonth ?? null;
    const birthDay = request.body.birthDay ?? null ; 

    // checking if the day actually exists in the month
    // ex: 31st does not exist in februrary
    if(birthMonth && birthDay){
      const daysInMonth = new Date(2000, birthMonth, 0).getDate();
      if(birthDay > daysInMonth) {
        return reply.code(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: `birthDay ${birthDay} does not exist in birthMonth ${birthMonth}`
        });
      }
    }

    // upsert into DB, relying on default values
    // updates birthmonth and birthday if present
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
