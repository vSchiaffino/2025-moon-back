import {
  BaseEntity,
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RampState } from './ramp-state.enum';
import { User } from '../user/user.entity';
import { WorkItem } from '../work-item/work-item.entity';

@Entity('ramps')
export class Ramp extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: RampState })
  state: RampState;

  @Column()
  code: string;

  @Column()
  type: string;

  @ManyToOne(() => User, (user) => user.ramps)
  user: User;

  @OneToMany(() => WorkItem, (workItem) => workItem.ramp)
  workItems: WorkItem[];

  @DeleteDateColumn()
  deletedAt: Date;
}
