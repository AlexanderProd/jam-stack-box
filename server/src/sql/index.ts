import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize';
import { join } from 'path';

import constants from '../config';
import Event from './Event';
import Site from './Site';

const sequelize = new Sequelize({
  dialect: 'mariadb',
  host: constants.DB_HOST,
  username: constants.DB_USER,
  password: constants.DB_PASSWORD,
  database: constants.DB_NAME,
  storage: join(constants.DB_DIR, constants.DB_NAME),
  models: [Site, Event],
  logging: false,
});

sequelize.sync({ alter: constants.MIGRATE_DB === 'true' });

export { Event, Site };
