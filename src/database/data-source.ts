/* eslint-disable @typescript-eslint/no-var-requires */

import { config } from 'dotenv';
import { Board } from 'src/boards/entities/boards.entity';
import { User } from 'src/users/entities/user.entity';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

config({
  path: __dirname + '/../../.env',
});

const migrationDirectory = path.join(__dirname, 'migration');
const migrationFiles = fs
  .readdirSync(migrationDirectory)
  .filter((file) => file.endsWith('.js'));

const migrations = migrationFiles.map((file) => {
  const requiredModule = require(path.join(migrationDirectory, file));
  return requiredModule[Object.keys(requiredModule)[0]];
});

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  password: process.env.DB_PASSWORD,
  username: process.env.DB_USERNAME,
  entities: [User, Board],
  database: process.env.DB_DATABASE,
  logging: true,
  migrations,
});
