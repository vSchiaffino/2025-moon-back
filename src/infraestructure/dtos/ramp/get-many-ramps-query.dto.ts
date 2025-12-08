import { IsOptional, IsString } from 'class-validator';
import { PaginatedQueryDto } from 'src/domain/dtos/paginated-query.dto';

export class GetManyRampsQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsString()
  states?: string;
}
