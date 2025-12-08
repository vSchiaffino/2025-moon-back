import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateWorkItemDto {
  @IsString()
  @IsNotEmpty()
  mechanic: string;

  @IsNumber()
  rampId: number;

  @IsNumber()
  appointmentId: number;
}
