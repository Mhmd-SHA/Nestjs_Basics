import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateStudentDto {
  @IsString({ message: 'Name must be a string' })
  @IsOptional()
  name?: string;

  @IsInt({ message: 'Age must be an integer' })
  @Min(1, { message: 'Age must be at least 1' })
  @IsOptional()
  age?: number;
}
