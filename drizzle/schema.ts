import { pgSchema, pgTable, varchar, serial, bigserial, boolean, timestamp, text, smallint, date, numeric, integer, index, foreignKey, primaryKey, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const costco = pgSchema("costco");
export const riot = pgSchema("riot");


export const costcoLocationsInCostco = costco.table("costco_locations", {
	street: varchar({ length: 128 }).notNull(),
	city: varchar({ length: 64 }).notNull(),
	state: varchar({ length: 2 }).notNull(),
	name: varchar({ length: 32 }),
	zip: varchar({ length: 10 }),
	createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
	deletedAt: timestamp("deleted_at"),
}, (table) => [
	primaryKey({ columns: [table.street, table.city, table.state], name: "pk_costco_locations"}),
]);

export const gasPricesInCostco = costco.table("gas_prices", {
	street: varchar({ length: 128 }).notNull(),
	city: varchar({ length: 64 }).notNull(),
	state: varchar({ length: 2 }).notNull(),
	gasType: varchar("gas_type", { length: 16 }).notNull(),
	createDate: date("create_date").default(sql`CURRENT_DATE`).notNull(),
	price: numeric({ precision: 4, scale: 2 }),
}, (table) => [
	primaryKey({ columns: [table.street, table.city, table.state, table.gasType, table.createDate], name: "pk_costco_prices"}),
	foreignKey({
		columns: [table.street, table.city, table.state],
		foreignColumns: [costcoLocationsInCostco.street, costcoLocationsInCostco.city, costcoLocationsInCostco.state],
		name: "fk_costco_prices"
	}).onUpdate("cascade").onDelete("cascade"),
]);

export const actionLogs = pgTable("action_logs", {
	id: bigserial({ mode: 'number' }).primaryKey(),
	actionName: varchar("action_name", { length: 64 }).notNull(),
	startedAt: timestamp("started_at").default(sql`CURRENT_TIMESTAMP`),
	finishedAt: timestamp("finished_at"),
	status: varchar({ length: 16 }),
	errorMessage: text("error_message"),
}, (table) => [
	index("idx_action_logs_lookup").using("btree", table.actionName.asc().nullsLast(), table.startedAt.desc().nullsFirst()),
]);

export const apiClients = pgTable("api_clients", {
	id: serial().notNull(),
	clientName: text("client_name"),
	apiKeyHash: text("api_key_hash"),
	createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
	deletedAt: timestamp("deleted_at"),
	lastUsedAt: timestamp("last_used_at"),
}, (table) => [
	primaryKey({ columns: [table.id], name: "api_client_keys_pkey"}),
	unique("api_client_keys_client_name_key").on(table.clientName),]);

export const discordAccounts = pgTable("discord_accounts", {
	discordId: varchar("discord_id", { length: 19 }).primaryKey(),
	admin: boolean().default(false),
	summonerName: varchar("summoner_name", { length: 32 }),
	birthMonth: smallint("birth_month"),
	birthDay: smallint("birth_day"),
	createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const externalServiceKeys = pgTable("external_service_keys", {
	source: varchar({ length: 64 }).notNull(),
	keyString: varchar("key_string", { length: 128 }),
}, (table) => [
	primaryKey({ columns: [table.source], name: "api_keys_pkey"}),
]);

export const guilds = pgTable("guilds", {
	guildId: varchar("guild_id", { length: 19 }).primaryKey(),
	createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
	deletedAt: timestamp("deleted_at"),
});

export const notificationChannels = pgTable("notification_channels", {
	guildId: varchar("guild_id", { length: 19 }).notNull().references(() => guilds.guildId, { onUpdate: "cascade" } ),
	notificationType: varchar("notification_type", { length: 32 }).notNull().references(() => notificationTypes.notificationType, { onUpdate: "cascade" } ),
	channelId: varchar("channel_id", { length: 19 }),
	createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
	deletedAt: timestamp("deleted_at"),
}, (table) => [
	primaryKey({ columns: [table.guildId, table.notificationType], name: "pk_notification_channels"}),
]);

export const notificationMembers = pgTable("notification_members", {
	guildId: varchar("guild_id", { length: 19 }).notNull(),
	notificationType: varchar("notification_type", { length: 32 }).notNull(),
	discordId: varchar("discord_id", { length: 19 }).notNull().references(() => discordAccounts.discordId, { onUpdate: "cascade" } ),
	createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
	deletedAt: timestamp("deleted_at"),
}, (table) => [
	primaryKey({ columns: [table.guildId, table.notificationType, table.discordId], name: "pk_notification_members"}),
	foreignKey({
		columns: [table.guildId, table.notificationType],
		foreignColumns: [notificationChannels.guildId, notificationChannels.notificationType],
		name: "fk_notification_members_1"
	}).onUpdate("cascade"),
]);

export const notificationTypes = pgTable("notification_types", {
	notificationType: varchar("notification_type", { length: 32 }).primaryKey(),
	createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
	deletedAt: timestamp("deleted_at"),
});

export const outros = pgTable("outros", {
	discordId: varchar("discord_id", { length: 19 }).primaryKey().references(() => discordAccounts.discordId, { onUpdate: "cascade" } ),
	url: varchar({ length: 128 }),
	startTime: smallint("start_time").default(0),
	duration: smallint().default(0),
	createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const gamesInRiot = riot.table("games", {
	game: varchar({ length: 16 }).primaryKey(),
	createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
	deletedAt: timestamp("deleted_at"),
});

export const matchParticipantsInRiot = riot.table("match_participants", {
	matchid: varchar({ length: 32 }).notNull().references(() => matchesInRiot.matchid, { onUpdate: "cascade" } ),
	puuid: varchar({ length: 78 }).notNull(),
	game: varchar({ length: 16 }).notNull(),
	createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
	deletedAt: timestamp("deleted_at"),
	duration: integer(),
	rankDelta: smallint("rank_delta"),
	rankChanged: boolean("rank_changed"),
}, (table) => [
	primaryKey({ columns: [table.matchid, table.puuid], name: "pk_match_participants"}),
	foreignKey({
		columns: [table.puuid, table.game],
		foreignColumns: [puuidsInRiot.puuid, puuidsInRiot.game],
		name: "fk_match_participants_2"
	}).onUpdate("cascade"),
]);

export const matchesInRiot = riot.table("matches", {
	matchid: varchar({ length: 32 }).notNull(),
	game: varchar({ length: 16 }).notNull().references(() => gamesInRiot.game, { onUpdate: "cascade" } ),
	startedAt: timestamp("started_at"),
	endedAt: timestamp("ended_at"),
	updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
	isRanked: boolean("is_ranked"),
	gamemode: varchar({ length: 32 }),
}, (table) => [
	primaryKey({ columns: [table.matchid], name: "pk_matches"}),
]);

export const participantLeagueStatsInRiot = riot.table("participant_league_stats", {
	matchid: varchar({ length: 32 }).notNull(),
	puuid: varchar({ length: 78 }).notNull(),
	createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
	deletedAt: timestamp("deleted_at"),
	team: varchar({ length: 4 }),
	won: boolean(),
	champion: varchar({ length: 32 }),
	gold: integer(),
	vision: smallint(),
	cs: smallint(),
	damageDealt: integer("damage_dealt"),
	damageTaken: integer("damage_taken"),
	damageHealed: integer("damage_healed"),
	pings: smallint(),
	kills: smallint(),
	assists: smallint(),
	deaths: smallint(),
	lane: varchar({ length: 8 }),
	role: varchar({ length: 8 }),
	surrendered: boolean(),
}, (table) => [
	primaryKey({ columns: [table.matchid, table.puuid], name: "pk_participant_league_stats"}),
	foreignKey({
		columns: [table.matchid, table.puuid],
		foreignColumns: [matchParticipantsInRiot.matchid, matchParticipantsInRiot.puuid],
		name: "fk_participant_league_status"
	}).onUpdate("cascade"),
]);

export const participantTftStatsInRiot = riot.table("participant_tft_stats", {
	matchid: varchar({ length: 32 }).notNull(),
	puuid: varchar({ length: 78 }).notNull(),
	createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
	deletedAt: timestamp("deleted_at"),
	placement: smallint(),
	lastRound: varchar("last_round", { length: 3 }),
	level: smallint(),
	gold: smallint(),
	damageDealt: smallint("damage_dealt"),
	boardGold: smallint("board_gold"),
	boardComp: varchar("board_comp", { length: 32 }),
}, (table) => [
	primaryKey({ columns: [table.matchid, table.puuid], name: "pk_participant_tft_stats"}),
	foreignKey({
		columns: [table.matchid, table.puuid],
		foreignColumns: [matchParticipantsInRiot.matchid, matchParticipantsInRiot.puuid],
		name: "fk_participant_tft_stats"
	}).onUpdate("cascade"),
]);

export const puuidsInRiot = riot.table("puuids", {
	riotId: varchar("riot_id", { length: 16 }).notNull(),
	riotTag: varchar("riot_tag", { length: 5 }).notNull(),
	game: varchar({ length: 16 }).notNull().references(() => gamesInRiot.game, { onUpdate: "cascade" } ),
	puuid: varchar({ length: 78 }).notNull(),
	createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
	deletedAt: timestamp("deleted_at"),
}, (table) => [
	primaryKey({ columns: [table.game, table.puuid], name: "pk_puuids"}),
	foreignKey({
		columns: [table.riotId, table.riotTag],
		foreignColumns: [riotAccountsInRiot.riotId, riotAccountsInRiot.riotTag],
		name: "fk_puuids_1"
	}).onUpdate("cascade"),
]);

export const ranksInRiot = riot.table("ranks", {
	gamemode: varchar({ length: 20 }).notNull(),
	puuid: varchar({ length: 78 }).notNull(),
	game: varchar({ length: 16 }).notNull(),
	tier: varchar({ length: 16 }),
	tierRank: varchar("tier_rank", { length: 3 }),
	leaguePoints: smallint("league_points"),
	createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	primaryKey({ columns: [table.gamemode, table.puuid, table.game], name: "pk_ranks"}),
	foreignKey({
		columns: [table.puuid, table.game],
		foreignColumns: [puuidsInRiot.puuid, puuidsInRiot.game],
		name: "fk_ranks"
	}).onUpdate("cascade"),
]);

export const riotAccountsInRiot = riot.table("riot_accounts", {
	riotId: varchar("riot_id", { length: 16 }).notNull(),
	riotTag: varchar("riot_tag", { length: 5 }).notNull(),
	discordId: varchar("discord_id", { length: 19 }).references(() => discordAccounts.discordId, { onUpdate: "cascade" } ),
	createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
	deletedAt: timestamp("deleted_at"),
}, (table) => [
	primaryKey({ columns: [table.riotId, table.riotTag], name: "pk_riot_accounts"}),
]);
