import { Ramp } from 'src/infraestructure/entities/ramp/ramp.entity';
import { IBaseRepository } from './base-repository.interface';
import { PaginatedQueryDto } from 'src/domain/dtos/paginated-query.dto';
import { PaginatedResultDto } from 'src/domain/dtos/paginated-result.dto';

export interface IRampRepository extends IBaseRepository<Ramp> {
  getRampsOf(
    id: number,
    query: PaginatedQueryDto,
  ): Promise<PaginatedResultDto<Ramp>>;
  getRampTypesFor(id: number): Promise<string[]>;
  findRampByCodeAndMechanic(
    code: string,
    mechanicId: number,
  ): Promise<Ramp | null>;
  findRampById(rampId: number): Promise<Ramp | null>;
}

export const IRampRepositoryToken = 'IRampRepository';
