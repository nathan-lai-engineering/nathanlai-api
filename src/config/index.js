import 'dotenv/config';

// all configuration will be determined through coolify environment variables

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
};