import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { WorkItem } from '../entities/work-item/work-item.entity';
import { IWorkItemRepository } from './interfaces/work-item-repository.interface';
import { PaginatedQueryDto } from 'src/domain/dtos/paginated-query.dto';
import { PaginatedResultDto } from 'src/domain/dtos/paginated-result.dto';
import { GetManyWorkItemsQueryDto } from '../dtos/work-item/get-many-work-item-query.dto';

@Injectable()
export class WorkItemRepository
  extends Repository<WorkItem>
  implements IWorkItemRepository
{
  constructor(private dataSource: DataSource) {
    super(WorkItem, dataSource.createEntityManager());
  }

  getDetail(id: number): Promise<WorkItem | null> {
    return this.findOne({
      where: { id },
      relations: ['ramp', 'logs', 'mechanic', 'appointment'],
      withDeleted: true,
    });
  }

  findById(id: number): Promise<WorkItem | null> {
    return this.findOne({
      where: { id },
      relations: ['mechanic', 'ramp', 'appointment'],
      withDeleted: true,
    });
  }

  async getMany(
    workShopId: number,
    query: GetManyWorkItemsQueryDto,
  ): Promise<PaginatedResultDto<WorkItem>> {
    const { orderBy, orderDir, page, pageSize, states } = query;

    const [data, total] = await this.findAndCount({
      where: {
        mechanic: { id: workShopId },
        state: states ? In(states.split(',')) : undefined,
      },
      take: pageSize,
      skip: ((page || 1) - 1) * (pageSize || 10),
      order: {
        [orderBy || 'id']: orderDir || 'DESC',
      },
      relations: ['ramp'],
      withDeleted: true,
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
}
