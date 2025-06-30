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
  await datasourceNewDatabase.query(`CREATE SCHEMA IF NOT EXISTS blog;`);
  await datasourceNewDatabase.destroy();
  process.exit(0);
})();
