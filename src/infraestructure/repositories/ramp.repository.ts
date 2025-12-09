import { Injectable } from '@nestjs/common';
import { DataSource, ILike, In, Repository } from 'typeorm';
import { Ramp } from '../entities/ramp/ramp.entity';
import { IRampRepository } from './interfaces/ramp-repository.interface';
import { PaginatedResultDto } from 'src/domain/dtos/paginated-result.dto';
import { GetManyRampsQueryDto } from '../dtos/ramp/get-many-ramps-query.dto';
import { JwtPayload } from 'src/domain/dtos/jwt-payload.interface';
import { RampDashboardData } from 'src/domain/interfaces/ramp-service.interface';

@Injectable()
export class RampRepository
  extends Repository<Ramp>
  implements IRampRepository
{
  constructor(private dataSource: DataSource) {
    super(Ramp, dataSource.createEntityManager());
  }

  getDashboardRampsData(userId: number): Promise<RampDashboardData[]> {
    return this.dataSource
      .createQueryBuilder()
      .select('ramps.code', 'rampName')
      .addSelect('COUNT(work_items.id)', 'quantity')
      .from('work_items', 'work_items')
      .innerJoin('ramps', 'ramps', 'ramps.id = work_items.rampId')
      .where('work_items.userId = :userId', { userId })
      .groupBy('work_items.rampId')
      .addGroupBy('ramps.code')
      .getRawMany();
  }

  findRampById(rampId: number) {
    return this.findOne({ where: { id: rampId }, relations: ['user'] });
  }

  async getRampsOf(
    id: number,
    query: GetManyRampsQueryDto,
  ): Promise<PaginatedResultDto<Ramp>> {
    const { orderBy, orderDir, page, pageSize, search, states } = query;

    const [data, total] = await this.findAndCount({
      where: {
        user: { id },
        code: search ? ILike(`%${search}%`) : undefined,
        state: states ? In(states.split(',')) : undefined,
      },
      take: pageSize,
      skip: ((page || 1) - 1) * (pageSize || 10),
      order: {
        [orderBy || 'id']: orderDir || 'DESC',
      },
    });
    return {
      total,
      data,
      orderBy: query.orderBy || 'id',
      orderDir: query.orderDir || 'DESC',
      page: page || 1,
      pageSize: pageSize || 10,
    };
  }

  async getRampTypesFor(mechanicId: number): Promise<string[]> {
    const rows = await this.createQueryBuilder('ramps')
      .select('DISTINCT ramps.type', 'type')
      .where('ramps.userId = :mechanicId', { mechanicId })
      .getRawMany();
    return rows.map((r) => r.type);
  }

  findRampByCodeAndMechanic(
    code: string,
    mechanicId: number,
  ): Promise<Ramp | null> {
    return this.findOneBy({ code, user: { id: mechanicId } });
  }
}
