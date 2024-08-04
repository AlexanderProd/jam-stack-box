import { join } from 'path';

const constants = {
  PORT: process.env.PORT ? process.env.PORT : 3000,
  FRONTEND_DIR: join(__dirname, '/../../frontend/dist/'),
  BUILDER_PATH: join(__dirname, '/../../builder/'),
  SITES_DIR: join(__dirname, '/../../sites-public/'),
  BUILD_CACHE_DIR: join(__dirname, '/../../build-cache/'),
  BUILDER_IMAGE_TAG: 'jamstackbox_builder',
  DB_DIALECT: process.env.DB_DIALECT ? process.env.DB_DIALECT : 'sqlite',
  DB_DIR: join(__dirname, '/../../db/'),
  DB_HOST: process.env.DB_HOST ? process.env.DB_HOST : undefined,
  DB_NAME: process.env.DB_NAME ? process.env.DB_NAME : 'main.db',
  DB_PORT: process.env.DB_PORT ? process.env.DB_PORT : 3306,
  DB_USER: process.env.DB_USER ? process.env.DB_USER : undefined,
  DB_PASSWORD: process.env.DB_PASSWORD ? process.env.DB_PASSWORD : undefined,
  MIGRATE_DB: process.env.MIGRATE_DB ? process.env.MIGRATE_DB : 'false',
};

export default constants;
