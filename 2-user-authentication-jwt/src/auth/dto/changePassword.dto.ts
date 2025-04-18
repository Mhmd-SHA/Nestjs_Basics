import { Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @MinLength(6)
  @Matches(/^(?=.*[0-9])/, {
    message:
      'Password must contain at least 6 characters, including uppercase, lowercase, numbers, and symbols',
  })
  oldPassword: string;
  @MinLength(6)
  @Matches(/^(?=.*[0-9])/, {
    message:
      'Password must contain at least 6 characters, including uppercase, lowercase, numbers, and symbols',
  })
  newPassword: string;
}
