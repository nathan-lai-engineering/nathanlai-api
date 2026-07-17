import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	gasPricesInCostco: {
		costcoLocationsInCostco: r.one.costcoLocationsInCostco({
			from: [r.gasPricesInCostco.street, r.gasPricesInCostco.city, r.gasPricesInCostco.state],
			to: [r.costcoLocationsInCostco.street, r.costcoLocationsInCostco.city, r.costcoLocationsInCostco.state]
		}),
	},
	costcoLocationsInCostco: {
		gasPricesInCostcos: r.many.gasPricesInCostco(),
	},
	guilds: {
		notificationTypes: r.many.notificationTypes({
			from: r.guilds.guildId.through(r.notificationChannels.guildId),
			to: r.notificationTypes.notificationType.through(r.notificationChannels.notificationType)
		}),
	},
	notificationTypes: {
		guilds: r.many.guilds(),
	},
	notificationChannels: {
		discordAccounts: r.many.discordAccounts({
			from: [r.notificationChannels.guildId.through(notificationMembers.guildId), r.notificationChannels.notificationType.through(notificationMembers.notificationType)],
			to: r.discordAccounts.discordId.through(r.notificationMembers.discordId)
		}),
	},
	discordAccounts: {
		notificationChannels: r.many.notificationChannels(),
		outros: r.many.outros(),
		riotAccountsInRiots: r.many.riotAccountsInRiot(),
	},
	outros: {
		discordAccount: r.one.discordAccounts({
			from: r.outros.discordId,
			to: r.discordAccounts.discordId
		}),
	},
	riotAccountsInRiot: {
		gamesInRiots: r.many.gamesInRiot({
			from: [r.riotAccountsInRiot.riotId.through(puuidsInRiot.riotId), r.riotAccountsInRiot.riotTag.through(puuidsInRiot.riotTag)],
			to: r.gamesInRiot.game.through(r.puuidsInRiot.game)
		}),
		discordAccount: r.one.discordAccounts({
			from: r.riotAccountsInRiot.discordId,
			to: r.discordAccounts.discordId
		}),
	},
	gamesInRiot: {
		riotAccountsInRiots: r.many.riotAccountsInRiot(),
	},
	ranksInRiot: {
		puuidsInRiot: r.one.puuidsInRiot({
			from: [r.ranksInRiot.puuid, r.ranksInRiot.game],
			to: [r.puuidsInRiot.puuid, r.puuidsInRiot.game]
		}),
	},
	puuidsInRiot: {
		ranksInRiots: r.many.ranksInRiot(),
	},
}))