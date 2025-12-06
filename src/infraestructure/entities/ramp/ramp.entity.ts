import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RampState } from './ramp-state.enum';
import { User } from '../user/user.entity';

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
}
