import { Constants } from './@types';

import { join } from 'path';

const constants: Constants = {
  PORT: process.env.PORT ? process.env.PORT : 3000,
  DB_DIR: process.env.DOCKER === 'false' ? join(__dirname, '/../db/') : '/db/',
  FRONTEND_DIR: join(__dirname, '/../../frontend/dist/'),
  BUILDER_PATH: join(__dirname, '/../../builder/'),
  SITES_DIR:
    process.env.DOCKER === 'false'
      ? join(__dirname, '/../../sites-public/')
      : '/sites-public/',
};

export default constants;
