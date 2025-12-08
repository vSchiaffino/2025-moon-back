import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Appointment } from '../appointment/appointment.entity';
import { Ramp } from '../ramp/ramp.entity';

@Entity('work_items')
export class WorkItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

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

  @CreateDateColumn()
  createdAt: Date;
}
