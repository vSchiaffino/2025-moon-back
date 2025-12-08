import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { WorkItemLog } from '../entities/work-item/work-item-log.entity';
import { IWorkItemLogRepository } from './interfaces/work-item-log-repository.interface';
import { WorkItemState } from '../entities/work-item/work-item-state.enum';

@Injectable()
export class WorkItemLogRepository
  extends Repository<WorkItemLog>
  implements IWorkItemLogRepository
{
  constructor(private dataSource: DataSource) {
    super(WorkItemLog, dataSource.createEntityManager());
  }

  createLog(
    id: number,
    fromState: WorkItemState,
    toState: WorkItemState,
  ): Promise<WorkItemLog> {
    return this.save({ fromState, toState, workItem: { id } });
  }
}
