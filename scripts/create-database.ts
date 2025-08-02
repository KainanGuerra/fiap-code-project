import 'tsconfig-paths/register';
import { DataSource } from 'typeorm';

import { databaseConfig } from '../src/config/database.config';

const config = databaseConfig();

void (async () => {
  const datasourceNewDatabase = new DataSource({
    ...config,
    schema: 'public',
  });
  await datasourceNewDatabase.initialize();

  const dbExists = await datasourceNewDatabase.query(
    `SELECT 1 FROM pg_database WHERE datname = '${config.database}';`,
  );

  if (dbExists.length === 0) {
    await datasourceNewDatabase.query(
      `CREATE DATABASE IF NOT EXISTS ${config.database};`,
    );
  }
  await datasourceNewDatabase.destroy();
  process.exit(0);
})();
