import 'reflect-metadata';
import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import {
  POSTGRES_DB,
  POSTGRES_HOST,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_USER,
} from '@/constants/app-settings';
import { BaseRepository } from '@/repositories/base-repository';

const isDev = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';
const isUat = process.env.NODE_ENV === 'uat';

const config: Options<PostgreSqlDriver> = {
  highlighter: new SqlHighlighter(),
  metadataProvider: TsMorphMetadataProvider,
  driver: PostgreSqlDriver,
  host: POSTGRES_HOST,
  dbName: isTest ? `${POSTGRES_DB}_${process.env.JEST_WORKER_ID}` : POSTGRES_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  port: POSTGRES_PORT,
  driverOptions:
    isDev || isTest || isUat
      ? undefined
      : {
          connection: { ssl: { rejectUnauthorized: false } },
        },
  loadStrategy: 'joined',
  entities: ['dist/**/entities/*'],
  entitiesTs: ['src/models'],
  entityRepository: BaseRepository,

  extensions: [Migrator],
  migrations: {
    disableForeignKeys: false,
    transactional: true,
    allOrNothing: true,
    path: 'dist/migrations',
    pathTs: 'src/migrations',
    snapshotName: 'migrations-snapshot',
    fileName: (timestamp: string, name?: string) => {
      // force user to provide the name, otherwise you would end up with `Migration20230421212713_undefined`
      if (!name) {
        throw new Error('Specify migration name via `migration:create --name=...`');
      }

      // Check if the name contains only letters, and underscores
      const isValidName = /^[a-zA-Z_]+$/.test(name);
      if (!isValidName) {
        throw new Error('Migration name can only contain letters, and underscores.');
      }

      return `Migration${timestamp}_${name}`;
    },
  },
};

export default config;
