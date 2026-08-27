import { db, discordAccounts, riotAccountsInRiot, puuidsInRiot } from '#db';
import { eq, and} from 'drizzle-orm';

const getDiscordAccountSchema = {
  querystring: {
    type: 'object',
    properties: {
      discordId: { type: 'string', description: 'Discord snowflake' },
    },
    required: ['discordId'],
  },
};

export default async function discordAccountRoutes(fastify) {
  fastify.get('/discord', { schema: getDiscordAccountSchema }, async (request, reply) => {
    const { discordId } = request.query;

    // pull basic discord account information saved in db
    const [discordAccountResult] = await db.select({
            discordId: discordAccounts.discordId,
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
    return reply.callNotFound();
  });
}
