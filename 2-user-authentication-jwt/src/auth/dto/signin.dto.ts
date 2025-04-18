import { IsEmail, Matches, MinLength } from 'class-validator';

export class SignInDto {
  @IsEmail()
  email: string;
  @MinLength(6)
  @Matches(/^(?=.*[0-9])/, {
    message:
      'Password must contain at least 6 characters, including uppercase, lowercase, numbers, and symbols',
  })
  password: string;
}
