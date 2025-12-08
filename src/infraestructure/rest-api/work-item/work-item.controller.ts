import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  type IWorkItemService,
  IWorkItemServiceToken,
} from 'src/domain/interfaces/work-item.interface';
import { AuthenticatedWorkshop } from '../decorators/authenticated-mechanic.decorator';
import { type JwtPayload } from 'src/domain/dtos/jwt-payload.interface';
import { CreateWorkItemDto } from 'src/infraestructure/dtos/work-item/create-work-item.dto';

@Controller('work-items')
export class WorkItemController {
  constructor(
    @Inject(IWorkItemServiceToken)
    private readonly workItemService: IWorkItemService,
  ) {}

  @Post()
  createWorkItem(
    @AuthenticatedWorkshop() mechanic: JwtPayload,
    @Body() dto: CreateWorkItemDto,
  ) {
    return this.workItemService.createWorkItem(mechanic, dto);
  }
}
