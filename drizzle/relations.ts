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
		channelTypes: r.many.channelTypes({
			from: r.guilds.guildId.through(r.guildChannels.guildId),
			to: r.channelTypes.channelType.through(r.guildChannels.channelType)
		}),
		modules: r.many.modules(),
	},
	channelTypes: {
		guilds: r.many.guilds(),
	},
	modules: {
		guilds: r.many.guilds({
			from: r.modules.name.through(r.guildModules.moduleName),
			to: r.guilds.guildId.through(r.guildModules.guildId)
		}),
	},
	guildChannels: {
		discordAccounts: r.many.discordAccounts({
			from: [r.guildChannels.guildId.through(notificationMembers.guildId), r.guildChannels.channelType.through(notificationMembers.channelType)],
			to: r.discordAccounts.discordId.through(r.notificationMembers.discordId)
		}),
	},
	discordAccounts: {
		guildChannels: r.many.guildChannels(),
		outros: r.many.outros(),
		riotAccountsInRiots: r.many.riotAccountsInRiot(),
	},
	outros: {
		discordAccount: r.one.discordAccounts({
			from: r.outros.discordId,
			to: r.discordAccounts.discordId
		}),
	},
	matchesInRiot: {
		puuidsInRiots: r.many.puuidsInRiot({
			from: r.matchesInRiot.matchid.through(r.matchParticipantsInRiot.matchid),
			to: [r.puuidsInRiot.puuid.through(matchParticipantsInRiot.puuid), r.puuidsInRiot.game.through(matchParticipantsInRiot.game)]
		}),
		gamesInRiot: r.one.gamesInRiot({
			from: r.matchesInRiot.game,
			to: r.gamesInRiot.game
		}),
	},
	puuidsInRiot: {
		matchesInRiots: r.many.matchesInRiot(),
		ranksInRiots: r.many.ranksInRiot(),
	},
	gamesInRiot: {
		matchesInRiots: r.many.matchesInRiot(),
		riotAccountsInRiots: r.many.riotAccountsInRiot(),
	},
	participantLeagueStatsInRiot: {
		matchParticipantsInRiot: r.one.matchParticipantsInRiot({
			from: [r.participantLeagueStatsInRiot.matchid, r.participantLeagueStatsInRiot.puuid],
			to: [r.matchParticipantsInRiot.matchid, r.matchParticipantsInRiot.puuid]
		}),
	},
	matchParticipantsInRiot: {
		participantLeagueStatsInRiots: r.many.participantLeagueStatsInRiot(),
		participantTftStatsInRiots: r.many.participantTftStatsInRiot(),
	},
	participantTftStatsInRiot: {
		matchParticipantsInRiot: r.one.matchParticipantsInRiot({
			from: [r.participantTftStatsInRiot.matchid, r.participantTftStatsInRiot.puuid],
			to: [r.matchParticipantsInRiot.matchid, r.matchParticipantsInRiot.puuid]
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
	ranksInRiot: {
		puuidsInRiot: r.one.puuidsInRiot({
			from: [r.ranksInRiot.puuid, r.ranksInRiot.game],
			to: [r.puuidsInRiot.puuid, r.puuidsInRiot.game]
		}),
	},
}))