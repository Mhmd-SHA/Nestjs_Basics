/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.getExtractedToken(request);
    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }
    try {
      const payload: any = this.jwtService.verify(token);
      console.log('payload :>> ', payload);
      request['userId'] = payload.id as string;
      if (!payload) {
        throw new UnauthorizedException('Unauthorized');
      }
    } catch (error) {
      Logger.error('error :>> ', error);
      throw new UnauthorizedException('Unauthorized');
    }
    return true;
  }

  private getExtractedToken(request: Request): string | undefined {
    return request.headers.authorization?.split(' ')[1];
  }
}
