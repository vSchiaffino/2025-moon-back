import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  type IWorkItemService,
  IWorkItemServiceToken,
} from 'src/domain/interfaces/work-item.interface';
import { AuthenticatedWorkshop } from '../decorators/authenticated-mechanic.decorator';
import { type JwtPayload } from 'src/domain/dtos/jwt-payload.interface';
import { CreateWorkItemDto } from 'src/infraestructure/dtos/work-item/create-work-item.dto';
import { PaginatedQueryDto } from 'src/domain/dtos/paginated-query.dto';
import { EditWorkItemDto } from 'src/infraestructure/dtos/work-item/edit-work-item.dto';
import { EditWorkItemStateDto } from 'src/infraestructure/dtos/work-item/edit-work-item-state.dto';

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

  @Put('/:id')
  editWorkItem(
    @AuthenticatedWorkshop() mechanic: JwtPayload,
    @Param('id', new ParseIntPipe()) id: number,
    @Body() dto: EditWorkItemDto,
  ) {
    return this.workItemService.editWorkItem(id, mechanic, dto);
  }

  @Put('/:id/state')
  editWorkItemState(
    @AuthenticatedWorkshop() mechanic: JwtPayload,
    @Param('id', new ParseIntPipe()) id: number,
    @Body() dto: EditWorkItemStateDto,
  ) {
    return this.workItemService.editWorkItemState(id, mechanic, dto);
  }

  @Get()
  getWorkItems(
    @AuthenticatedWorkshop() mechanic: JwtPayload,
    @Query() query: PaginatedQueryDto,
  ) {
    return this.workItemService.getWorkItems(mechanic, query);
  }

  @Get(':id')
  getWorkItemDetail(
    @AuthenticatedWorkshop() mechanic: JwtPayload,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.workItemService.getWorkItemDetail(mechanic, id);
  }
}
