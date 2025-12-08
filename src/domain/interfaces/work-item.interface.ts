import { CreateWorkItemDto } from 'src/infraestructure/dtos/work-item/create-work-item.dto';
import { JwtPayload } from '../dtos/jwt-payload.interface';

export interface IWorkItemService {
  createWorkItem(mechanic: JwtPayload, dto: CreateWorkItemDto);
}

export const IWorkItemServiceToken = 'IWorkItemServiceToken';
