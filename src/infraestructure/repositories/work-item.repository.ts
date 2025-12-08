import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { WorkItem } from '../entities/work-item/work-item.entity';
import { IWorkItemRepository } from './interfaces/work-item-repository.interface';

@Injectable()
export class WorkItemRepository
  extends Repository<WorkItem>
  implements IWorkItemRepository
{
  constructor(private dataSource: DataSource) {
    super(WorkItem, dataSource.createEntityManager());
  }
}
