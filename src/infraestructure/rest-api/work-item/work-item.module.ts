import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkItemController } from './work-item.controller';
import { WorkItem } from 'src/infraestructure/entities/work-item/work-item.entity';
import { IWorkItemRepositoryToken } from 'src/infraestructure/repositories/interfaces/work-item-repository.interface';
import { WorkItemRepository } from 'src/infraestructure/repositories/work-item.repository';
import { Module } from '@nestjs/common';
import { IWorkItemServiceToken } from 'src/domain/interfaces/work-item.interface';
import { WorkItemService } from 'src/domain/services/work-item/work-item.service';
import { AppointmentModule } from '../appointment/appointment.module';
import { RampModule } from '../ramp/ramp.module';
import { IWorkItemLogRepositoryToken } from 'src/infraestructure/repositories/interfaces/work-item-log-repository.interface';
import { WorkItemLogRepository } from 'src/infraestructure/repositories/work-item-log.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkItem]),
    AppointmentModule,
    RampModule,
  ],
  controllers: [WorkItemController],
  providers: [
    { provide: IWorkItemRepositoryToken, useClass: WorkItemRepository },
    { provide: IWorkItemLogRepositoryToken, useClass: WorkItemLogRepository },
    { provide: IWorkItemServiceToken, useClass: WorkItemService },
  ],
  exports: [IWorkItemServiceToken],
})
export class WorkItemModule {}
