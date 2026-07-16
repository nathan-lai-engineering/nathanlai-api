-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE SCHEMA "costco";
--> statement-breakpoint
CREATE SCHEMA "riot";
--> statement-breakpoint
CREATE TABLE "costco"."costco_locations" (
	"street" varchar(128),
	"city" varchar(64),
	"state" varchar(2),
	"name" varchar(32),
	"zip" varchar(10),
	"created_at" timestamp,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "costco"."gas_prices" (
	"street" varchar(128),
	"city" varchar(64),
	"state" varchar(2),
	"gas_type" varchar(16),
	"create_date" date,
	"price" numeric(4,2)
);
--> statement-breakpoint
CREATE TABLE "api_keys" (
	"source" varchar(64) PRIMARY KEY,
	"key_string" varchar(128)
);
--> statement-breakpoint
CREATE TABLE "discord_accounts" (
	"discord_id" varchar(19) PRIMARY KEY,
	"admin" boolean,
	"summoner_name" varchar(32),
	"birth_month" smallint,
	"birth_day" smallint,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "guilds" (
	"guild_id" varchar(19) PRIMARY KEY,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "notification_channels" (
	"guild_id" varchar(19),
	"notification_type" varchar(32),
	"channel_id" varchar(19),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"deleted_at" timestamp,
	CONSTRAINT "pk_notification_channels" PRIMARY KEY("guild_id","notification_type")
);
--> statement-breakpoint
CREATE TABLE "notification_members" (
	"guild_id" varchar(19),
	"notification_type" varchar(32),
	"discord_id" varchar(19),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"deleted_at" timestamp,
	CONSTRAINT "pk_notification_members" PRIMARY KEY("guild_id","notification_type","discord_id")
);
--> statement-breakpoint
CREATE TABLE "notification_types" (
	"notification_type" varchar(32) PRIMARY KEY,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "outros" (
	"discord_id" varchar(19) PRIMARY KEY,
	"url" varchar(128),
	"start_time" smallint DEFAULT 0,
	"duration" smallint DEFAULT 0,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "riot"."games" (
	"game" varchar(16) PRIMARY KEY,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "riot"."puuids" (
	"riot_id" varchar(16),
	"riot_tag" varchar(5),
	"game" varchar(16),
	"puuid" varchar(78),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"deleted_at" timestamp,
	CONSTRAINT "pk_puuids" PRIMARY KEY("riot_id","riot_tag","game"),
	CONSTRAINT "ck_puuids" UNIQUE("game","puuid")
);
--> statement-breakpoint
CREATE TABLE "riot"."ranks" (
	"gamemode" varchar(20),
	"puuid" varchar(78),
	"game" varchar(16),
	"tier" varchar(16),
	"tier_rank" varchar(3),
	"league_points" smallint,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "pk_ranks" PRIMARY KEY("gamemode","puuid","game")
);
--> statement-breakpoint
CREATE TABLE "riot"."riot_accounts" (
	"riot_id" varchar(16),
	"riot_tag" varchar(5),
	"discord_id" varchar(19),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"deleted_at" timestamp,
	CONSTRAINT "pk_riot_accounts" PRIMARY KEY("riot_id","riot_tag")
);
--> statement-breakpoint
ALTER TABLE "notification_channels" ADD CONSTRAINT "fk_notification_channels_1" FOREIGN KEY ("guild_id") REFERENCES "guilds"("guild_id") ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "notification_channels" ADD CONSTRAINT "fk_notification_channels_2" FOREIGN KEY ("notification_type") REFERENCES "notification_types"("notification_type") ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "notification_members" ADD CONSTRAINT "fk_notification_members_1" FOREIGN KEY ("guild_id","notification_type") REFERENCES "notification_channels"("guild_id","notification_type") ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "notification_members" ADD CONSTRAINT "fk_notification_members_2" FOREIGN KEY ("discord_id") REFERENCES "discord_accounts"("discord_id") ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "outros" ADD CONSTRAINT "fk_outros" FOREIGN KEY ("discord_id") REFERENCES "discord_accounts"("discord_id") ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "riot"."riot_accounts" ADD CONSTRAINT "fk_riot_accounts" FOREIGN KEY ("discord_id") REFERENCES "discord_accounts"("discord_id") ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "riot"."puuids" ADD CONSTRAINT "fk_puuids_1" FOREIGN KEY ("riot_id","riot_tag") REFERENCES "riot"."riot_accounts"("riot_id","riot_tag") ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "riot"."puuids" ADD CONSTRAINT "fk_puuids_2" FOREIGN KEY ("game") REFERENCES "riot"."games"("game") ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "riot"."ranks" ADD CONSTRAINT "fk_ranks" FOREIGN KEY ("puuid","game") REFERENCES "riot"."puuids"("puuid","game") ON UPDATE CASCADE;
*/