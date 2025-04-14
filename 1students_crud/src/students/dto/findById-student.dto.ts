import { IsInt, Min } from 'class-validator';

export class findByIdStudentDto {
  @IsInt({ message: 'ID must be an integer' })
  @Min(1, { message: 'ID must be at least 1' })
  id: number;
}
