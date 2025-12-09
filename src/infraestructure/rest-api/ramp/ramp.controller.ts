import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  type IRampService,
  IRampServiceToken,
} from 'src/domain/interfaces/ramp-service.interface';
import { AuthenticatedWorkshop } from '../decorators/authenticated-mechanic.decorator';
import { type JwtPayload } from 'src/domain/dtos/jwt-payload.interface';
import { CreateRampDto } from 'src/infraestructure/dtos/ramp/create-ramp.dto';
import { GetManyRampsQueryDto } from 'src/infraestructure/dtos/ramp/get-many-ramps-query.dto';

@Controller('ramps')
export class RampController {
  constructor(
    @Inject(IRampServiceToken)
    private readonly rampService: IRampService,
  ) {}

  @Get('/types')
  getRampTypes(@AuthenticatedWorkshop() mechanic: JwtPayload) {
    return this.rampService.getRampTypesFor(mechanic);
  }

  @Post()
  createRamp(
    @AuthenticatedWorkshop() mechanic: JwtPayload,
    @Body() dto: CreateRampDto,
  ) {
    return this.rampService.createRamp(mechanic, dto);
  }

  @Get()
  getRamps(
    @AuthenticatedWorkshop() mechanic: JwtPayload,
    @Query() query: GetManyRampsQueryDto,
  ) {
    return this.rampService.getRampsOf(mechanic, query);
  }

  @Put(':id')
  editRamp(
    @AuthenticatedWorkshop() mechanic: JwtPayload,
    @Param('id') id: string,
    @Body() dto: CreateRampDto,
  ) {
    return this.rampService.editRamp(mechanic, id, dto);
  }

  @Delete(':id')
  deleteRamp(
    @AuthenticatedWorkshop() mechanic: JwtPayload,
    @Param('id') id: string,
  ) {
    return this.rampService.deleteRamp(mechanic, id);
  }

  @Get('/dashboard')
  getRampsData(@AuthenticatedWorkshop() mechanic: JwtPayload) {
    return this.rampService.getDashboardRampsData(mechanic);
  }
}
