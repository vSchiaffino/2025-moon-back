import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Appointment } from '../appointment/appointment.entity';
import { Ramp } from '../ramp/ramp.entity';
import { WorkItemState } from './work-item-state.enum';
import { WorkItemLog } from './work-item-log.entity';

@Entity('work_items')
export class WorkItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: WorkItemState,
    default: WorkItemState.PENDING,
  })
  state: WorkItemState;

  @Column()
  mechanicName: string;

  @ManyToOne(() => Ramp, (ramp) => ramp.workItems)
  @JoinColumn({ name: 'rampId' })
  ramp: Ramp;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  mechanic: User;

  @OneToOne(() => Appointment, (appointment) => appointment.workItem)
  @JoinColumn({ name: 'appointmentId' })
  appointment: Appointment;

  @OneToMany(() => WorkItemLog, (log) => log.workItem)
  logs: WorkItemLog[];

  @CreateDateColumn()
  createdAt: Date;
}
