import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import Site from './Site';

export type EventStatus =
  | 'preparing'
  | 'building'
  | 'failed'
  | 'success'
  | 'stopped';

interface EventAttributes {
  id: number;
  name: string | null;
  status: EventStatus;
  description: string | null;
  log: string | null;
  siteId: string;
}

interface EventCreationAttributes
  extends Optional<EventAttributes, 'id' | 'name' | 'description' | 'log'> {}

@Table({ tableName: 'events' })
class Event extends Model<EventAttributes, EventCreationAttributes> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  })
  id: number;

  @Column({ allowNull: true })
  name: string | null;

  @Column({ type: DataType.STRING, allowNull: false })
  status: EventStatus;

  @Column({ type: DataType.TEXT, allowNull: true })
  description: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  log: string | null;

  @ForeignKey(() => Site)
  @Column({ allowNull: false })
  siteId: string;

  @BelongsTo(() => Site, { foreignKey: 'siteId' })
  site: Site;
}

export default Event;
