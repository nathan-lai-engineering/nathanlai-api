import { db, discordAccounts} from '#db';
import { eq, and, isNull } from 'drizzle-orm';

const getSchema = {
  tags: ['discord-accounts'],
  security: [{ apiKeyAuth: [] }]
};

export default async function (fastify) {
  fastify.get('/', { schema: getSchema }, async (request, reply) => {
    // full list of all account birthdays
    const birthdayResults = await db.select({
      discordId: discordAccounts.discordId,
      birthMonth: discordAccounts.birthMonth,
      birthDate: discordAccounts.birthDay
    })
    .from(discordAccounts)

    // no result
    if(!birthdayResults){
      return reply.callNotFound();
    }

    // reformat to map by discord id
    const discordBirthdays = {};
    birthdayResults.forEach((row) => {
        discordBirthdays[row.discordId] = {month: row.birthMonth, date: row.birthDate};
    });

    return discordBirthdays;
  });
}
