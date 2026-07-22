import * as fs from 'fs';
import { sql } from 'drizzle-orm';
import api_paths from './riot_api_paths.json' with { type: 'json' };
import {db, costcoLocationsInCostco, gasPricesInCostco} from '#db'

const db = drizzle(config.databaseUrl);

