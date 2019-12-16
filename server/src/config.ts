import { Constants } from './@types';

import { join } from 'path';

const constants: Constants = {
  PORT: 3000,
  DB_DIR:
    process.env.NODE_ENV === 'development'
      ? join(__dirname, '/../db/')
      : '/data/db',
  FRONTEND_DIR: join(__dirname, '/../../frontend/dist/'),
  BUILDER_PATH: join(__dirname, '/../../builder/'),
  SITES_DIR:
    process.env.NODE_ENV === 'development'
      ? join(__dirname, '/../../sites-public/')
      : '/data/sites-public/',
};

export default constants;
