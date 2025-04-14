import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNumber()
  @IsNotEmpty()
  @IsInt({ message: 'Age must be an integer' })
  @Min(1, { message: 'Age must be at least 1' })
  age: number;
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
