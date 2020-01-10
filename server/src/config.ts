import { Constants } from './@types';

import { join } from 'path';

const constants: Constants = {
  PORT: process.env.PORT ? process.env.PORT : 3000,
  DB_DIR: join(__dirname, '/../db/'),
  FRONTEND_DIR: join(__dirname, '/../../frontend/dist/'),
  BUILDER_PATH: join(__dirname, '/../../builder/'),
  SITES_DIR: join(__dirname, '/../../sites-public/'),
  BUILDER_IMAGE_TAG: 'jamstackbox_builder:latest',
};

export default constants;
