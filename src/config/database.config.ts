import path from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import { SnakeNamingStrategy } from '@Common/snake-naming.strategy';
const config = <PostgresConnectionOptions>{
  type: 'postgres',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  schema: 'public',
  installExtensions: false,
  namingStrategy: new SnakeNamingStrategy(),
  applicationName: 'FIAP - POST USER BLOG',
  autoLoadEntities: true,
  synchronize: false,
  entities: [path.resolve('src', 'modules', '**', '*.entity.{t,j}s')],
  migrations: [path.resolve('src', 'db', 'migrations', '*.{t,j}s')],
};

const configs = <Record<string, PostgresConnectionOptions>>{
  development: {
    ...config,
    logging: ['error', 'query'],
    logger: 'debug',
    migrationsRun: false,
    synchronize: false,
  },
  production: {
    ...config,
    logging: true,
    migrationsRun: false,
    synchronize: false,
    ssl: {
      rejectUnauthorized: false,
    },
  },
  test: {
    ...config,
    logging: true,
    logger: 'debug',
    migrationsRun: false,
    synchronize: false,
  },
};

export const databaseConfig = (): PostgresConnectionOptions => {
  return configs[process.env.NODE_ENV ?? 'development'];
};
