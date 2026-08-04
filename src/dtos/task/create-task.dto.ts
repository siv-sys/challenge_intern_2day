import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { TaskStatus } from '../../entities/task.entity';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'title is required' })
  @MaxLength(150, { message: 'title must be at most 150 characters' })
  title!: string;

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
