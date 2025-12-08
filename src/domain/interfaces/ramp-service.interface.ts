import { CreateRampDto } from 'src/infraestructure/dtos/ramp/create-ramp.dto';
import { JwtPayload } from '../dtos/jwt-payload.interface';
import { Ramp } from 'src/infraestructure/entities/ramp/ramp.entity';
import { PaginatedResultDto } from '../dtos/paginated-result.dto';
import { PaginatedQueryDto } from '../dtos/paginated-query.dto';

export interface IRampService {
  deleteRamp(mechanic: JwtPayload, id: string);
  editRamp(mechanic: JwtPayload, id: string, dto: CreateRampDto): Promise<Ramp>;
  getRampsOf(
    mechanic: JwtPayload,
    query: PaginatedQueryDto,
  ): Promise<PaginatedResultDto<Ramp>>;
  getRampTypesFor(mechanic: JwtPayload): Promise<string[]>;
  createRamp(mechanic: JwtPayload, dto: CreateRampDto): Promise<Ramp>;
  getRampById(rampId: number): Promise<Ramp | null>;
}

export const IRampServiceToken = 'IRampService';
