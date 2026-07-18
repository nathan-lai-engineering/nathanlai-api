import { drizzle } from 'drizzle-orm/node-postgres';
import { config } from '#config';

export * from '../../drizzle/schema.ts'; // pass along the schema
export const db = drizzle(config.databaseUrl);