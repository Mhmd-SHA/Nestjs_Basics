import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { UserId } from 'src/common/decorators/userId.decorator';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //signup
  @Post('signup')
  async SignUp(@Body() signupData: SignUpDto) {
    const user = await this.authService.SignUP(signupData);
    return {
      message: 'User created successfully',
      statusCode: 200,
      user: user,
    };
  }

  //login
  @Post('login')
  async Login(@Body() loginData: SignInDto) {
    const { accessToken, refreshToken, user } =
      await this.authService.SignIn(loginData);
    return {
      message: 'User logged in successfully',
      statusCode: 200,
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: user,
    };
  }

  //refreshToken
  @Post('refresh-token')
  async RefreshToken(@Body() refreshToken: RefreshTokenDto) {
    return await this.authService.RefreshToken(refreshToken);
  }

  //Change Password
  @Post('change-password')
  @UseGuards(AuthGuard)
  async ChangePassword(
    @Body() changePasswordData: ChangePasswordDto,
    @UserId() userId: string,
  ) {
    console.log('userID :>> ', userId);
    return await this.authService.ChangePassword(changePasswordData, userId);
  }

  //Forgot Password
  @Post('forgot-password')
  async ForgotPassword(@Body() ForgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.ForgotPassword(ForgotPasswordDto.email);
  }
  //Reset Password
  @Post('reset-password')
  async ResetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(
      resetPasswordDto.newPassword,
      resetPasswordDto.resetToken,
    );
  }
}
