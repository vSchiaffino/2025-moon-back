import { IsEnum } from 'class-validator';
import { WorkItemState } from 'src/infraestructure/entities/work-item/work-item-state.enum';

export class EditWorkItemStateDto {
  @IsEnum(WorkItemState)
  state: WorkItemState;
}
