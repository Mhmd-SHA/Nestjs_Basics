import { IsDefined, IsEmail, Matches, MinLength } from 'class-validator';

export class SignUpDto {
  @IsDefined({ message: 'Name is required' })
  name: string;
  @IsEmail()
  email: string;
  @MinLength(6)
  @Matches(/^(?=.*[0-9])/, {
    message:
      'Password must contain at least 6 characters, including uppercase, lowercase, numbers, and symbols',
  })
  password: string;
}
