import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtPayload } from 'src/domain/dtos/jwt-payload.interface';
import { PaginatedResultDto } from 'src/domain/dtos/paginated-result.dto';
import { IRampService } from 'src/domain/interfaces/ramp-service.interface';
import { CreateRampDto } from 'src/infraestructure/dtos/ramp/create-ramp.dto';
import { GetManyRampsQueryDto } from 'src/infraestructure/dtos/ramp/get-many-ramps-query.dto';
import { RampState } from 'src/infraestructure/entities/ramp/ramp-state.enum';
import { Ramp } from 'src/infraestructure/entities/ramp/ramp.entity';
import {
  type IRampRepository,
  IRampRepositoryToken,
} from 'src/infraestructure/repositories/interfaces/ramp-repository.interface';

@Injectable()
export class RampService implements IRampService {
  constructor(
    @Inject(IRampRepositoryToken)
    private readonly rampRepository: IRampRepository,
  ) {}

  async updateRampState(rampId: number, newState: RampState): Promise<void> {
    const ramp = await this.rampRepository.findRampById(rampId);
    if (!ramp) throw new NotFoundException();
    ramp.state = newState;
    await this.rampRepository.save(ramp);
  }

  getRampById(rampId: number) {
    return this.rampRepository.findRampById(rampId);
  }

  async deleteRamp(mechanic: JwtPayload, id: string) {
    const ramp = await this.rampRepository.findOne({
      where: { id: Number(id) },
      relations: ['user'],
    });
    if (!ramp) throw new NotFoundException('Ramp not found');
    if (ramp.user.id !== mechanic.id) throw new UnauthorizedException();
    await this.rampRepository.softDelete(ramp.id);
  }

  async editRamp(
    mechanic: JwtPayload,
    id: string,
    dto: CreateRampDto,
  ): Promise<Ramp> {
    const ramp = await this.rampRepository.findOne({
      where: { id: Number(id) },
      relations: ['user'],
    });
    if (!ramp) throw new NotFoundException('Ramp not found');
    if (ramp.user.id !== mechanic.id) throw new UnauthorizedException();
    const conflictedRamp = await this.rampRepository.findRampByCodeAndMechanic(
      dto.code,
      mechanic.id,
    );
    if (conflictedRamp && conflictedRamp?.id !== Number(id)) {
      throw new ConflictException('Existe otra rampa con ese code');
    }
    ramp.code = dto.code;
    ramp.state = dto.state;
    ramp.type = dto.type;
    return this.rampRepository.save(ramp);
  }

  getRampsOf(
    mechanic: JwtPayload,
    query: GetManyRampsQueryDto,
  ): Promise<PaginatedResultDto<Ramp>> {
    return this.rampRepository.getRampsOf(mechanic.id, query);
  }

  getRampTypesFor(mechanic: JwtPayload): Promise<string[]> {
    return this.rampRepository.getRampTypesFor(mechanic.id);
  }

  async createRamp(mechanic: JwtPayload, dto: CreateRampDto): Promise<Ramp> {
    const conflictedRamp = await this.rampRepository.findRampByCodeAndMechanic(
      dto.code,
      mechanic.id,
    );
    if (conflictedRamp)
      throw new ConflictException(
        `Ya existe una rampa con el código ${dto.code}`,
      );
    return this.rampRepository.save({
      ...dto,
      user: { id: mechanic.id },
    });
  }
}
