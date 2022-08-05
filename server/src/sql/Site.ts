import { Table, Model, Column, HasMany, DataType } from 'sequelize-typescript';
import { HostConfig } from 'dockerode';
import { Optional } from 'sequelize';

import { createSiteID } from '../util';
import Event from './Event';

interface SiteAttributes {
  id: string;
  name: string;
  displayName: string | null;
  source: string;
  buildCommand: string | null;
  nodeVersion: string | null;
  buildDir: string | null;
  githubAccessToken: string | null;
  siteURL: string | null;
  postBuildCommand: string | null;
  hostConfig: HostConfig | null;
  envVariables: { [key: string]: string };
}

interface SiteCreationAttributes
  extends Optional<
    SiteAttributes,
    | 'id'
    | 'displayName'
    | 'buildCommand'
    | 'buildDir'
    | 'githubAccessToken'
    | 'siteURL'
    | 'postBuildCommand'
    | 'hostConfig'
  > {}

@Table({ tableName: 'sites' })
class Site extends Model<SiteAttributes, SiteCreationAttributes> {
  @Column({
    defaultValue: () => createSiteID(),
    primaryKey: true,
  })
  id: string;

  @Column({
    unique: true,
    allowNull: false,
  })
  name: string;

  @Column({ allowNull: true })
  displayName: string;

  @Column({ allowNull: true })
  source: string;

  @Column({ allowNull: true })
  buildCommand!: string;

  @Column({ allowNull: true })
  nodeVersion!: string;

  @Column({ allowNull: true })
  buildDir: string;

  @Column({ allowNull: true })
  githubAccessToken: string;

  @Column({ allowNull: true })
  siteURL: string;

  @Column({ allowNull: true })
  postBuildCommand: string;

  @Column({ type: DataType.JSON, allowNull: true })
  containerHostConfig: HostConfig;

  @Column({ type: DataType.JSON, allowNull: true })
  envVariables: { [key: string]: string };

  @HasMany(() => Event)
  events: Event[];
}

export default Site;
