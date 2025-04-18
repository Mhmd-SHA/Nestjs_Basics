import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  @UseGuards(AuthGuard)
  getHello() {
    return {
      message: 'Server is running',
      statusCode: 200,
    };
  }
}
