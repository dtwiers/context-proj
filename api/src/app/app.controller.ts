import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../domains/auth/auth.service';
import { UsersService } from '../domains/users/users.service';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Post('bootstrap')
  async bootstrap(@Body() body: { key: string }) {
    if (
      typeof body === 'object' &&
      body !== null &&
      typeof body.key === 'string' &&
      body.key === 'startmeup'
    ) {
      const userCount = await this.usersService.userCount();
      console.log({ userCount });
      if (!userCount) {
        this.usersService.createUser({
          name: 'Admin',
          password: 'password',
          username: 'admin',
        });
      }
    } else {
      throw new BadRequestException('Key is required');
    }
  }

  @Get('/health-check')
  async healthCheck() {
    return 'all good';
  }
}
