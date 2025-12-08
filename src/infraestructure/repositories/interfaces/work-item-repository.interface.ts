import { WorkItem } from 'src/infraestructure/entities/work-item/work-item.entity';
import { IBaseRepository } from './base-repository.interface';

export interface IWorkItemRepository extends IBaseRepository<WorkItem> {}

export const IWorkItemRepositoryToken = 'IWorkItemRepository';
