import { WorkItemState } from 'src/infraestructure/entities/work-item/work-item-state.enum';
import { IBaseRepository } from './base-repository.interface';
import { WorkItemLog } from 'src/infraestructure/entities/work-item/work-item-log.entity';

export interface IWorkItemLogRepository extends IBaseRepository<WorkItemLog> {
  createLog(
    id: number,
    fromState: WorkItemState | null,
    toState: WorkItemState,
  ): Promise<WorkItemLog>;
}

export const IWorkItemLogRepositoryToken = 'IWorkItemLogRepositoryToken';
