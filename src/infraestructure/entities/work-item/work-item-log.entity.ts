import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WorkItemState } from './work-item-state.enum';
import { WorkItem } from './work-item.entity';

@Entity('work_items_logs')
export class WorkItemLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => WorkItem, (workitem) => workitem.logs)
  workItem: WorkItem;

  @Column({ type: 'enum', enum: WorkItemState, nullable: true })
  fromState?: WorkItemState;

  @Column({ type: 'enum', enum: WorkItemState })
  toState: WorkItemState;

  @CreateDateColumn()
  createdAt: Date;
}
