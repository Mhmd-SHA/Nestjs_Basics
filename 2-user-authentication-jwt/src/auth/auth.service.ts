import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.scheme';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { RefreshToken } from './schemas/refreshToken.scheme';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { ResetToken } from './schemas/resetToken.schema';
import { MailService } from 'src/service/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private usermodel: Model<User>,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshToken>,
    @InjectModel(ResetToken.name)
    private resetTokenModel: Model<ResetToken>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async SignIn(signInData: SignInDto) {
    //find if user exist
    const user = await this.usermodel.findOne({ email: signInData.email });
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }
    const isPasswordValid = await bcrypt.compare(
      signInData.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Unauthorized');
    }
    const token = await this.refreshTokenModel.findOne({
      userId: user._id,
    });
    if (token) {
      await token.deleteOne();
      console.log('deleted :>> ', 'deleted');
    }
    const { accessToken, refreshToken } = await this.generateToken(user);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async generateToken(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = {
      id: user._id,
      email: user.email,
      name: user.name,
    };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = uuidv4();
    await this.refreshTokenModel.create({
      userId: user._id,
      token: refreshToken,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  async SignUP(signUpData: SignUpDto) {
    //check if the email is already registered

    const emailInUse = await this.usermodel.findOne({
      email: signUpData.email,
    });
    if (emailInUse) {
      throw new BadRequestException('Email already in use');
    }

    //hash password
    const hashedPassword = await bcrypt.hash(signUpData.password, 10);
    //save user to the database mongoose
    const user = await this.usermodel.create({
      name: signUpData.name,
      email: signUpData.email,
      password: hashedPassword,
    });
    //remove password from the response
    return user;
  }

  async RefreshToken(refreshToken: RefreshTokenDto) {
    const token = await this.refreshTokenModel.findOne({
      token: refreshToken.refreshToken,
      expiryDate: { $gt: new Date() },
    });
    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }
    const user = await this.usermodel.findById(token.userId);
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }
    const { accessToken, refreshToken: newRefreshToken } =
      await this.generateToken(user);
    await token.deleteOne();
    return {
      accessToken,
      refreshToken: newRefreshToken,
      user,
    };
  }
  async ChangePassword(changePasswordData: ChangePasswordDto, userID: string) {
    const user = await this.usermodel.findById(userID);
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }
    const isPasswordValid = await bcrypt.compare(
      changePasswordData.oldPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Unauthorized');
    }
    const hashedPassword = await bcrypt.hash(
      changePasswordData.newPassword,
      10,
    );
    user.password = hashedPassword;
    await user.save();
    return {
      message: 'Password changed successfully',
      statusCode: 200,
    };
  }
  async ForgotPassword(email: string) {
    const user = await this.usermodel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }
    await this.resetTokenModel.deleteOne({ userId: user._id });
    const token = uuidv4();
    await this.resetTokenModel.create({
      userId: user._id,
      token: token,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    //TODO!: fix this
    // await this.mailService.sendPasswordResetEmail(user.email, token);
    return {
      message: 'Password reset link sent to your email',
      statusCode: 200,
    };
  }
  async resetPassword(newPassword: string, resetToken: string) {
    //Find a valid reset token document
    const token = await this.resetTokenModel.findOneAndDelete({
      token: resetToken,
      expiryDate: { $gte: new Date() },
    });

    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    //Change user password (MAKE SURE TO HASH!!)
    const user = await this.usermodel.findById(token.userId);
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
  }
}
