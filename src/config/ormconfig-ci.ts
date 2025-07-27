import 'dotenv/config';

import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

import { databaseConfig } from '@App/config/database.config';

export default new DataSource(<DataSourceOptions & SeederOptions>{
  ...databaseConfig(),
  cache: false,
  forceServerObjectId: true,
});
