import { Sequelize } from 'sequelize-typescript';
import { join } from 'path';

import constants from '../config';
import Event from './Event';
import Site from './Site';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: join(constants.DB_DIR, 'main.db'),
  models: [Site, Event],
  logging: false,
});

sequelize.sync({ alter: false });

export { Event, Site };
