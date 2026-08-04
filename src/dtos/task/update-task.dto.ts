import { IsDateString, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { TaskStatus } from '../../entities/task.entity';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'title must not be empty' })
  @MaxLength(150, { message: 'title must be at most 150 characters' })
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus, { message: `status must be one of: ${Object.values(TaskStatus).join(', ')}` })
  status?: TaskStatus;

  @IsOptional()
  @IsDateString({}, { message: 'dueDate must be a valid date (YYYY-MM-DD)' })
  dueDate?: string;
}
