import { CreateRampDto } from 'src/infraestructure/dtos/ramp/create-ramp.dto';
import { JwtPayload } from '../dtos/jwt-payload.interface';
import { Ramp } from 'src/infraestructure/entities/ramp/ramp.entity';
import { PaginatedResultDto } from '../dtos/paginated-result.dto';
import { RampState } from 'src/infraestructure/entities/ramp/ramp-state.enum';
import { GetManyRampsQueryDto } from 'src/infraestructure/dtos/ramp/get-many-ramps-query.dto';

export interface RampDashboardData {
  rampName: string;
  quantity: number;
}

export interface IRampService {
  getDashboardRampsData(mechanic: JwtPayload): Promise<RampDashboardData[]>;
  deleteRamp(mechanic: JwtPayload, id: string);
  editRamp(mechanic: JwtPayload, id: string, dto: CreateRampDto): Promise<Ramp>;
  getRampsOf(
    mechanic: JwtPayload,
    query: GetManyRampsQueryDto,
  ): Promise<PaginatedResultDto<Ramp>>;
  getRampTypesFor(mechanic: JwtPayload): Promise<string[]>;
  createRamp(mechanic: JwtPayload, dto: CreateRampDto): Promise<Ramp>;
  getRampById(rampId: number): Promise<Ramp | null>;
  updateRampState(rampId: number, newState: RampState): Promise<void>;
}

export const IRampServiceToken = 'IRampService';
