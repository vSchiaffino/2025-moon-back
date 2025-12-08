import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
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

export class WorkItemService implements IWorkItemService {
  constructor(
    @Inject(IWorkItemRepositoryToken)
    private workItemRepository: IWorkItemRepository,
    @Inject(IAppointmentServiceToken)
    private appointmentService: IAppointmentService,
    @Inject(IRampServiceToken)
    private rampService: IRampService,
  ) {}

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
    return workItem;
  }
}
