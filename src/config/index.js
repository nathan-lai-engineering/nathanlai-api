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
  databaseUrl: required('DATABASE_URL'), // url to access postgres database
  riotScrapeInterval: optional('RIOT_SCRAPE_INTERVAL', 300000), // interval to scrape riot api in milliseconds
  apiGlobalMaxRequests: optional('API_GLOBAL_MAX_REQUESTS', 1000), // max amount of requests in a window before api locks globally
  apiGlobalMaxWindow: optional('API_GLOBAL_MAX_WINDOW', 60000) // max amount to count requests
};