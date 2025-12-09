import { WorkItem } from 'src/infraestructure/entities/work-item/work-item.entity';
import { IBaseRepository } from './base-repository.interface';
import { PaginatedResultDto } from 'src/domain/dtos/paginated-result.dto';
import { GetManyWorkItemsQueryDto } from 'src/infraestructure/dtos/work-item/get-many-work-item-query.dto';

export interface IWorkItemRepository extends IBaseRepository<WorkItem> {
  getDetail(id: number): Promise<WorkItem | null>;
  findById(id: number): Promise<WorkItem | null>;
  getMany(
    id: number,
    query: GetManyWorkItemsQueryDto,
  ): Promise<PaginatedResultDto<WorkItem>>;
}

export const IWorkItemRepositoryToken = 'IWorkItemRepository';
