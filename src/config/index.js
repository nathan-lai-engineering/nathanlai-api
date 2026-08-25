import 'dotenv/config';

// all configuration will be determined through coolify environment variables
// this is determined at runtime once, so will require a restart

// required config variable
function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

// optional config variable, define a default value
function optional(name, defaultValue) {
    const value = process.env[name];
    return value ?? defaultValue;
}

export const config = {
  databaseUrl: required('DATABASE_URL'),
  riotScrapeInterval: optional('RIOT_SCRAPE_INTERVAL', 300000),
  apiGlobalMaxRequests: optional('API_GLOBAL_MAX_REQUESTS', 1000),
  apiGlobalMaxWindow: optional('API_GLOBAL_MAX_WINDOW', 60000)
};