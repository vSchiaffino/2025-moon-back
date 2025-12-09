import { CreateWorkItemDto } from 'src/infraestructure/dtos/work-item/create-work-item.dto';
import { JwtPayload } from '../dtos/jwt-payload.interface';
import { PaginatedResultDto } from '../dtos/paginated-result.dto';
import { WorkItem } from 'src/infraestructure/entities/work-item/work-item.entity';
import { EditWorkItemDto } from 'src/infraestructure/dtos/work-item/edit-work-item.dto';
import { EditWorkItemStateDto } from 'src/infraestructure/dtos/work-item/edit-work-item-state.dto';
import { GetManyWorkItemsQueryDto } from 'src/infraestructure/dtos/work-item/get-many-work-item-query.dto';
import {
  MechanicHoursData,
  ServicesHoursData,
} from 'src/infraestructure/repositories/interfaces/work-item-repository.interface';

export interface IWorkItemService {
  getServicesHoursData(mechanic: JwtPayload): Promise<ServicesHoursData[]>;
  getMechanicHoursData(mechanic: JwtPayload): Promise<MechanicHoursData[]>;
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
    query: GetManyWorkItemsQueryDto,
  ): Promise<PaginatedResultDto<WorkItem>>;
  createWorkItem(
    mechanic: JwtPayload,
    dto: CreateWorkItemDto,
  ): Promise<WorkItem>;
  getWorkItemDetail(mechanic: JwtPayload, id: number): Promise<WorkItem>;
}

export const IWorkItemServiceToken = 'IWorkItemServiceToken';
