// src/common/decorators/user-id.decorator.ts
import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

export const UserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request: Request = ctx.switchToHttp().getRequest();
    const userID: string | undefined = request['userId'] as string;
    if (userID === undefined) {
      throw new UnauthorizedException('Unauthorized');
    }
    return request['userId'] as string; // Make sure this is set in your guard or middleware
  },
);
