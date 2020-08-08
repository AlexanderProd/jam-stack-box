import {
  Model,
  Sequelize,
  DataTypes,
  Association,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyCreateAssociationMixin,
} from 'sequelize';
import { join } from 'path';

import constants from '../config';
import { createSiteID, isProd } from '../util';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: join(constants.DB_DIR, 'main.db'),
  logging: !isProd,
});

sequelize.sync();

export class Site extends Model {
  public id!: string;
  public name!: string;
  public displayName!: string | null;
  public source!: string | null;
  public buildCommand!: string | null;
  public githubAccessToken!: string | null;
  public siteURL!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getEvents!: HasManyGetAssociationsMixin<Event>;
  public addEvent!: HasManyAddAssociationMixin<Event, number>;
  public hasEvent!: HasManyHasAssociationMixin<Event, number>;
  public createEvent!: HasManyCreateAssociationMixin<Event>;

  public static associations: {
    events: Association<Site, Event>;
  };
}

export class Event extends Model {
  public id!: number;
  public name!: string | null;
  public status!: 'prepare' | 'building' | 'failure' | 'sucess' | 'stopped';
  public description!: string | null;
  public log!: string | null;
  public siteId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Site.init(
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: () => createSiteID(),
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    buildCommand: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    githubAccessToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    siteURL: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { sequelize: sequelize, tableName: 'sites' }
);

Event.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    siteId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    log: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  { sequelize: sequelize, tableName: 'events' }
);

Site.hasMany(Event, {
  sourceKey: 'id',
  foreignKey: 'siteId',
  as: 'events',
});
