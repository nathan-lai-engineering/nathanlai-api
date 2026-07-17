import { pgSchema, pgTable, varchar, boolean, timestamp, smallint, date, numeric, foreignKey, primaryKey, unique } from "drizzle-orm/pg-core"
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

export const apiKeys = pgTable("api_keys", {
	source: varchar({ length: 64 }).primaryKey(),
	keyString: varchar("key_string", { length: 128 }),
});

export const discordAccounts = pgTable("discord_accounts", {
	discordId: varchar("discord_id", { length: 19 }).primaryKey(),
	admin: boolean(),
	summonerName: varchar("summoner_name", { length: 32 }),
	birthMonth: smallint("birth_month"),
	birthDay: smallint("birth_day"),
	createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

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
	updatedAt: timestamp("updated_at"),
});

export const gamesInRiot = riot.table("games", {
	game: varchar({ length: 16 }).primaryKey(),
	createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
	deletedAt: timestamp("deleted_at"),
});

export const puuidsInRiot = riot.table("puuids", {
	riotId: varchar("riot_id", { length: 16 }).notNull(),
	riotTag: varchar("riot_tag", { length: 5 }).notNull(),
	game: varchar({ length: 16 }).notNull().references(() => gamesInRiot.game, { onUpdate: "cascade" } ),
	puuid: varchar({ length: 78 }),
	createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
	deletedAt: timestamp("deleted_at"),
}, (table) => [
	primaryKey({ columns: [table.riotId, table.riotTag, table.game], name: "pk_puuids"}),
	foreignKey({
		columns: [table.riotId, table.riotTag],
		foreignColumns: [riotAccountsInRiot.riotId, riotAccountsInRiot.riotTag],
		name: "fk_puuids_1"
	}).onUpdate("cascade"),
	unique("ck_puuids").on(table.game, table.puuid),]);

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
