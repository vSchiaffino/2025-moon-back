import { WorkItem } from 'src/infraestructure/entities/work-item/work-item.entity';
import { IBaseRepository } from './base-repository.interface';
import { PaginatedQueryDto } from 'src/domain/dtos/paginated-query.dto';
import { PaginatedResultDto } from 'src/domain/dtos/paginated-result.dto';

export interface IWorkItemRepository extends IBaseRepository<WorkItem> {
  getDetail(id: number): Promise<WorkItem | null>;
  findById(id: number): Promise<WorkItem | null>;
  getMany(
    id: number,
    query: PaginatedQueryDto,
  ): Promise<PaginatedResultDto<WorkItem>>;
}

export const IWorkItemRepositoryToken = 'IWorkItemRepository';
