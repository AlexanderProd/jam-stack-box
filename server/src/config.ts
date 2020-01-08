import { Constants } from './@types';

import { join } from 'path';

const constants: Constants = {
  PORT: process.env.PORT ? process.env.PORT : 3000,
  DB_DIR: process.env.DOCKER === 'true' ? '/db/' : join(__dirname, '/../db/'),
  FRONTEND_DIR: join(__dirname, '/../../frontend/dist/'),
  BUILDER_PATH: join(__dirname, '/../../builder/'),
  SITES_DIR:
    process.env.DOCKER === 'true'
      ? '/sites-public/'
      : join(__dirname, '/../../sites-public/'),
};

export default constants;
