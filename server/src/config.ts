import { Constants } from './@types';

const constants: Constants = {
  PORT: 3000,
  DB_FOLDER: process.env.NODE_ENV === 'development' ? './db/' : '/data/db',
  FRONTEND_DIR: '/../../frontend/dist/',
  BUILDER_PATH: '/../../../builder/',
};

export default constants;
