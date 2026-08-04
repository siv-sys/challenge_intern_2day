import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { TaskStatus } from '../../entities/task.entity';

export const TASK_SORTABLE_FIELDS = ['createdAt', 'dueDate', 'title', 'status'] as const;
export type TaskSortableField = (typeof TASK_SORTABLE_FIELDS)[number];

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page must be an integer' })
  @Min(1, { message: 'page must be at least 1' })
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit must be an integer' })
  @Min(1, { message: 'limit must be at least 1' })
  @Max(100, { message: 'limit must be at most 100' })
  limit: number = 10;

  @IsOptional()
  @IsIn(TASK_SORTABLE_FIELDS, {
    message: `sortBy must be one of: ${TASK_SORTABLE_FIELDS.join(', ')}`,
  })
  sortBy: TaskSortableField = 'createdAt';

  @IsOptional()
  @IsIn(['ASC', 'DESC'], { message: 'sortOrder must be ASC or DESC' })
  sortOrder: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @IsEnum(TaskStatus, { message: `status must be one of: ${Object.values(TaskStatus).join(', ')}` })
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  @MaxLength(150, { message: 'search must be at most 150 characters' })
  search?: string;
}
