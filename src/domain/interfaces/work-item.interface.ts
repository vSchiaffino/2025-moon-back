import { CreateWorkItemDto } from 'src/infraestructure/dtos/work-item/create-work-item.dto';
import { JwtPayload } from '../dtos/jwt-payload.interface';
import { PaginatedQueryDto } from '../dtos/paginated-query.dto';
import { PaginatedResultDto } from '../dtos/paginated-result.dto';
import { WorkItem } from 'src/infraestructure/entities/work-item/work-item.entity';
import { EditWorkItemDto } from 'src/infraestructure/dtos/work-item/edit-work-item.dto';
import { EditWorkItemStateDto } from 'src/infraestructure/dtos/work-item/edit-work-item-state.dto';

export interface IWorkItemService {
  editWorkItemState(
    id: number,
    mechanic: JwtPayload,
    dto: EditWorkItemStateDto,
  ): Promise<WorkItem>;
  editWorkItem(
    id: number,
    mechanic: JwtPayload,
    dto: EditWorkItemDto,
  ): Promise<WorkItem>;
  getWorkItems(
    mechanic: JwtPayload,
    query: PaginatedQueryDto,
  ): Promise<PaginatedResultDto<WorkItem>>;
  createWorkItem(
    mechanic: JwtPayload,
    dto: CreateWorkItemDto,
  ): Promise<WorkItem>;
  getWorkItemDetail(mechanic: JwtPayload, id: number): Promise<WorkItem>;
}

export const IWorkItemServiceToken = 'IWorkItemServiceToken';
