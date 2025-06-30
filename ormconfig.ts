import 'dotenv/config';

import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

import { databaseConfig } from '@App/config/database.config';

const getPath = () =>
  ['test', 'development'].includes(process.env.NODE_ENV as string) ? `src` : '';
export default new DataSource(<DataSourceOptions & SeederOptions>{
  ...databaseConfig(),
  cache: false,
  forceServerObjectId: true,
  seeds: [`${getPath()}/db/seeds/**/*.{t,j}s`],
  factories: [`${getPath()}/db/factories/**/*.{t,j}s`],
});
