import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EditWorkItemDto {
  @IsString()
  @IsNotEmpty()
  mechanic: string;

  @IsNumber()
  rampId: number;
}
