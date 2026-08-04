import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class IdParamDto {
  @Type(() => Number)
  @IsInt({ message: 'id must be an integer' })
  @Min(1, { message: 'id must be a positive integer' })
  id!: number;
}
