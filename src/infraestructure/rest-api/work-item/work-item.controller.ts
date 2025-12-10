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
import { EditWorkItemDto } from 'src/infraestructure/dtos/work-item/edit-work-item.dto';
import { EditWorkItemStateDto } from 'src/infraestructure/dtos/work-item/edit-work-item-state.dto';
import { GetManyWorkItemsQueryDto } from 'src/infraestructure/dtos/work-item/get-many-work-item-query.dto';

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
  async editWorkItem(
    @AuthenticatedWorkshop() mechanic: JwtPayload,
    @Param('id', new ParseIntPipe()) id: number,
    @Body() dto: EditWorkItemDto,
  ) {
    const ret = await this.workItemService.editWorkItem(id, mechanic, dto);
    // @ts-expect-error dont hashedPassword
    ret.mechanic.hashedPassword = undefined;
    return ret;
  }

  @Put('/:id/state')
  async editWorkItemState(
    @AuthenticatedWorkshop() mechanic: JwtPayload,
    @Param('id', new ParseIntPipe()) id: number,
    @Body() dto: EditWorkItemStateDto,
  ) {
    const value = await this.workItemService.editWorkItemState(
      id,
      mechanic,
      dto,
    );
    // @ts-expect-error dont hashedPassword
    value.mechanic.hashedPassword = undefined;
    return value;
  }

  @Get()
  getWorkItems(
    @AuthenticatedWorkshop() mechanic: JwtPayload,
    @Query() query: GetManyWorkItemsQueryDto,
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

  @Get('/dashboard/mechanic-hours')
  getMechanicHoursData(@AuthenticatedWorkshop() mechanic: JwtPayload) {
    return this.workItemService.getMechanicHoursData(mechanic);
  }

  @Get('/dashboard/services-hours')
  getServicesHoursData(@AuthenticatedWorkshop() mechanic: JwtPayload) {
    return this.workItemService.getServicesHoursData(mechanic);
  }
}
