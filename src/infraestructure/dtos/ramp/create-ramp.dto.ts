import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { RampState } from 'src/infraestructure/entities/ramp/ramp-state.enum';

export class CreateRampDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsEnum(RampState)
  state: RampState;
}
