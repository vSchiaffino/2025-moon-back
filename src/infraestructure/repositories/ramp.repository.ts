import { Injectable } from '@nestjs/common';
import { DataSource, ILike, Repository } from 'typeorm';
import { Ramp } from '../entities/ramp/ramp.entity';
import { IRampRepository } from './interfaces/ramp-repository.interface';
import { PaginatedQueryDto } from 'src/domain/dtos/paginated-query.dto';
import { PaginatedResultDto } from 'src/domain/dtos/paginated-result.dto';

@Injectable()
export class RampRepository
  extends Repository<Ramp>
  implements IRampRepository
{
  constructor(private dataSource: DataSource) {
    super(Ramp, dataSource.createEntityManager());
  }

  findRampById(rampId: number) {
    return this.findOne({ where: { id: rampId }, relations: ['user'] });
  }

  async getRampsOf(
    id: number,
    query: PaginatedQueryDto,
  ): Promise<PaginatedResultDto<Ramp>> {
    const { orderBy, orderDir, page, pageSize, search } = query;
    const [data, total] = await this.findAndCount({
      where: { user: { id }, code: search ? ILike(`%${search}%`) : undefined },
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
