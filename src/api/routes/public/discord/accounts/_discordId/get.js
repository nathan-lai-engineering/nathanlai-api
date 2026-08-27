import { db, discordAccounts, riotAccountsInRiot, puuidsInRiot } from '#db';
import { eq, and} from 'drizzle-orm';

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
};

export default async function (fastify) {
  fastify.get('/', { schema: getSchema }, async (request, reply) => {
    const discordId = request.params.discordId;

    // pull basic discord account information saved in db
    const [discordAccountResult] = await db.select({
            discordId: discordAccounts.discordId,
            birthMonth: discordAccounts.birthMonth,
            birthDate: discordAccounts.birthDay,
            admin: discordAccounts.admin,
            riotId: riotAccountsInRiot.riotId,
            riotTag: riotAccountsInRiot.riotTag
        })
        .from(discordAccounts)
        .leftJoin(riotAccountsInRiot, eq(discordAccounts.discordId, riotAccountsInRiot.discordId))
        .where(eq(discordAccounts.discordId, discordId))
        .limit(1);
        
    if(discordAccountResult){
        let riotName = discordAccountResult.riotId ? `${discordAccountResult.riotId}#${discordAccountResult.riotTag}` : "";
        
        // data to return
        const discordData = {
            discordId: discordAccountResult.discordId,
            discordBotAdmin: discordAccountResult.admin,
            birthMonth: discordAccountResult.birthMonth,
            birthDate: discordAccountResult.birthDate,
            riotName: riotName,
            puuids: {}
        };

        // pull associated riot games data
        if(discordAccountResult.riotId){
            const riotPuuids = await db.select({
                game: puuidsInRiot.game,
                puuid: puuidsInRiot.puuid
            })
            .from(puuidsInRiot)
            .where(and(eq(puuidsInRiot.riotId, discordAccountResult.riotId), eq(puuidsInRiot.riotTag, discordAccountResult.riotTag)))
            
            riotPuuids.forEach(gamePuuid => {
                discordData.puuids[gamePuuid.game] = gamePuuid.puuid
            });
        }


        return discordData;
    }

    // no result for discord account in db
    return reply.callNotFound();
  });
}
