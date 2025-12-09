import { IsOptional, IsString } from 'class-validator';
import { PaginatedQueryDto } from 'src/domain/dtos/paginated-query.dto';

export class GetManyWorkItemsQueryDto extends PaginatedQueryDto {
  @IsOptional()
  @IsString()
  states: string;
}
