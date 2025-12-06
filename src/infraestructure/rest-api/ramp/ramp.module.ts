import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ramp } from 'src/infraestructure/entities/ramp/ramp.entity';
import { RampController } from './ramp.controller';
import { IRampServiceToken } from 'src/domain/interfaces/ramp-service.interface';
import { RampService } from 'src/domain/services/ramp/ramp.service';
import { IRampRepositoryToken } from 'src/infraestructure/repositories/interfaces/ramp-repository.interface';
import { RampRepository } from 'src/infraestructure/repositories/ramp.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Ramp])],
  controllers: [RampController],
  providers: [
    { provide: IRampServiceToken, useClass: RampService },
    { provide: IRampRepositoryToken, useClass: RampRepository },
  ],
  exports: [IRampServiceToken],
})
export class RampModule {}
