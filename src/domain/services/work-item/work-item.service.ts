import {
  BadRequestException,
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtPayload } from 'src/domain/dtos/jwt-payload.interface';
import { IWorkItemService } from 'src/domain/interfaces/work-item.interface';
import { CreateWorkItemDto } from 'src/infraestructure/dtos/work-item/create-work-item.dto';
import {
  type IWorkItemRepository,
  IWorkItemRepositoryToken,
} from 'src/infraestructure/repositories/interfaces/work-item-repository.interface';
import {
  IAppointmentServiceToken,
  type IAppointmentService,
} from 'src/domain/interfaces/appointment-service.interface';
import { AppointmentStatus } from 'src/infraestructure/entities/appointment/appointment-status.enum';
import {
  type IRampService,
  IRampServiceToken,
} from 'src/domain/interfaces/ramp-service.interface';
import { PaginatedQueryDto } from 'src/domain/dtos/paginated-query.dto';
import { PaginatedResultDto } from 'src/domain/dtos/paginated-result.dto';
import { WorkItem } from 'src/infraestructure/entities/work-item/work-item.entity';
import { EditWorkItemDto } from 'src/infraestructure/dtos/work-item/edit-work-item.dto';
import { EditWorkItemStateDto } from 'src/infraestructure/dtos/work-item/edit-work-item-state.dto';
import {
  type IWorkItemLogRepository,
  IWorkItemLogRepositoryToken,
} from 'src/infraestructure/repositories/interfaces/work-item-log-repository.interface';
import { WorkItemState } from 'src/infraestructure/entities/work-item/work-item-state.enum';
import { RampState } from 'src/infraestructure/entities/ramp/ramp-state.enum';

export class WorkItemService implements IWorkItemService {
  constructor(
    @Inject(IWorkItemRepositoryToken)
    private workItemRepository: IWorkItemRepository,
    @Inject(IAppointmentServiceToken)
    private appointmentService: IAppointmentService,
    @Inject(IRampServiceToken)
    private rampService: IRampService,
    @Inject(IWorkItemLogRepositoryToken)
    private workItemLogRepository: IWorkItemLogRepository,
  ) {}

  async editWorkItemState(
    id: number,
    mechanic: JwtPayload,
    dto: EditWorkItemStateDto,
  ): Promise<WorkItem> {
    const workItem = await this.workItemRepository.findById(id);
    if (!workItem)
      throw new NotFoundException('orden de trabajo no encontrada');
    if (workItem.mechanic.id !== mechanic.id) throw new UnauthorizedException();
    const previousState = workItem.state;
    workItem.state = dto.state;

    const updatedWorkItem = await this.workItemRepository.save(workItem);
    await this.updateAppointmentState(
      updatedWorkItem,
      workItem.appointment.id,
      mechanic,
    );
    await this.updateRampState(workItem);
    await this.workItemLogRepository.createLog(
      workItem.id,
      previousState,
      updatedWorkItem.state,
    );
    return updatedWorkItem;
  }

  async updateAppointmentState(
    workItem: WorkItem,
    appointmentId: number,
    mechanic: JwtPayload,
  ) {
    const workItemStateToAppointmentState = {
      [WorkItemState.PAUSED]: AppointmentStatus.IN_SERVICE,
      [WorkItemState.WORKING]: AppointmentStatus.IN_SERVICE,
      [WorkItemState.CANCELLED]: AppointmentStatus.CANCELLED,
      [WorkItemState.DONE]: AppointmentStatus.SERVICE_COMPLETED,
    };
    const statesWithAppointmentUpdate = Object.keys(
      workItemStateToAppointmentState,
    ) as WorkItemState[];
    if (statesWithAppointmentUpdate.includes(workItem.state)) {
      const appointment =
        await this.appointmentService.getAppointmentById(appointmentId);
      const newAppointmentState =
        workItemStateToAppointmentState[workItem.state];
      if (appointment?.status === newAppointmentState) return;
      await this.appointmentService.updateStatus(
        appointmentId,
        newAppointmentState,
        mechanic,
      );
    }
  }

  async updateRampState(workItem: WorkItem) {
    const workItemStateToRampState = {
      [WorkItemState.CANCELLED]: RampState.FREE,
      [WorkItemState.DONE]: RampState.FREE,
      [WorkItemState.WORKING]: RampState.OCCUPIED,
      [WorkItemState.PENDING]: RampState.OCCUPIED,
    };
    const workItemStatesWithRampStateUpdate = Object.keys(
      workItemStateToRampState,
    ) as WorkItemState[];
    if (workItemStatesWithRampStateUpdate.includes(workItem.state)) {
      await this.rampService.updateRampState(
        workItem.ramp.id,
        workItemStateToRampState[workItem.state],
      );
    }
  }

  async editWorkItem(
    id: number,
    mechanic: JwtPayload,
    dto: EditWorkItemDto,
  ): Promise<WorkItem> {
    const workItem = await this.workItemRepository.findById(id);
    if (!workItem)
      throw new NotFoundException('orden de trabajo no encontrada');
    if (workItem.mechanic.id !== mechanic.id) throw new UnauthorizedException();
    const ramp = await this.rampService.getRampById(dto.rampId);
    if (!ramp || ramp.user.id !== mechanic.id) throw new NotFoundException();

    workItem.mechanicName = dto.mechanic;
    workItem.ramp.id = dto.rampId;

    return this.workItemRepository.save(workItem);
  }

  getWorkItems(
    mechanic: JwtPayload,
    query: PaginatedQueryDto,
  ): Promise<PaginatedResultDto<WorkItem>> {
    return this.workItemRepository.getMany(mechanic.id, query);
  }

  async createWorkItem(mechanic: JwtPayload, dto: CreateWorkItemDto) {
    const ramp = await this.rampService.getRampById(dto.rampId);
    const appointment = await this.appointmentService.getAppointmentById(
      dto.appointmentId,
    );
    if (!ramp || ramp.user.id !== mechanic.id)
      throw new NotFoundException('Rampa no encontrada');
    if (!appointment) throw new NotFoundException('Turno no encontrado');
    if (appointment.status !== AppointmentStatus.PENDING)
      throw new BadRequestException(
        'No se puede confirmar un turno que no esté pendiente',
      );

    const workItem = await this.workItemRepository.save({
      appointment: { id: dto.appointmentId },
      ramp: { id: dto.rampId },
      mechanic: { id: mechanic.id },
      mechanicName: dto.mechanic,
    });
    await this.appointmentService.updateStatus(
      dto.appointmentId,
      AppointmentStatus.CONFIRMED,
      mechanic,
    );
    await this.workItemLogRepository.createLog(
      workItem.id,
      null,
      WorkItemState.PENDING,
    );
    return (await this.workItemRepository.getDetail(workItem.id)) as WorkItem;
  }

  async getWorkItemDetail(mechanic: JwtPayload, id: number) {
    const workItem = await this.workItemRepository.getDetail(id);

    if (!workItem || workItem?.mechanic.id !== mechanic.id)
      throw new NotFoundException();

    return {
      ...workItem,
      logs: workItem.logs.sort((a, b) => b.id - a.id),
      mechanic: undefined,
    } as unknown as WorkItem;
  }
}
