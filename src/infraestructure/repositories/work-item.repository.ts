import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { WorkItem } from '../entities/work-item/work-item.entity';
import {
  IWorkItemRepository,
  MechanicHoursData,
  ServicesHoursData,
} from './interfaces/work-item-repository.interface';
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

  async getServicesHoursData(mechanicId: number): Promise<ServicesHoursData[]> {
    const raws = await this.dataSource
      .createQueryBuilder()
      .select('s.name', 'serviceName')
      .addSelect('AVG(wi.realWorkTimeMs) / 3600000', 'avgHours')
      .from('work_items', 'wi')
      .innerJoin('appointments', 'a', 'wi.appointmentId = a.id')
      .innerJoin('appointment_services', 'aps', 'aps.appointment_id = a.id')
      .innerJoin('services', 's', 's.id = aps.service_id')
      .where('wi.realWorkTimeMs IS NOT NULL')
      .andWhere('wi.userId = :id', { id: mechanicId })
      .groupBy('aps.service_id')
      .addGroupBy('s.name')
      .orderBy('"avgHours"', 'DESC')
      .getRawMany();

    return raws.map((raw) => ({
      serviceName: raw.serviceName,
      avgHours: Number(raw.avgHours),
    }));
  }

  async getMechanicHoursData(mechanicId: number): Promise<MechanicHoursData[]> {
    const raws = await this.createQueryBuilder()
      .select('wi.mechanicName')
      .addSelect('SUM(wi.realWorkTimeMs) / 3600000', 'hours')
      .from('work_items', 'wi')
      .where('wi.userId = :id', { id: mechanicId })
      .andWhere(`wi.realWorkTimeMs IS NOT NULL`)
      .groupBy('wi.mechanicName')
      .orderBy(`hours`, 'DESC')
      .getRawMany();
    return raws.map((raw) => ({
      hours: raw.hours,
      mechanicName: raw.wi_mechanicName,
    }));
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
