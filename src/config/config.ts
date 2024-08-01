import * as dotenv from 'dotenv';
import { getNumber, getString } from './utils';

export function isProduction() {
  return process.env.NODE_ENV === 'production';
}

export function isDevelopment() {
  return process.env.NODE_ENV === 'development';
}

if (isDevelopment()) {
  dotenv.config({ path: '.env.development' });
}

export const Config = {
  db: {
    host: getString('DB_HOST'),
    port: getNumber('DB_PORT'),
    username: getString('DB_USERNAME'),
    password: getString('DB_PASSWORD'),
    database: getString('DB_DATABASE'),
  },
  log: {
    logDirectory: getString('LOG_DIRECTORY'),
    daysToKeepLogs: getString('LOG_DAYS_TO_KEEP'),
    fileLogLevel: getString('LOG_FILE_LEVEL'),
    consoleLogLevel: getString('LOG_CONSOLE_LEVEL'),
  },
  redis: {
    host: getString('REDIS_HOST'),
    port: getNumber('REDIS_PORT'),
  },
};
