import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Paginated, User } from '../../api-interface';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request as ExpressRequest } from 'express';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async findMe(@Request() req: ExpressRequest) {
    const user = await this.userService.user({
      username: (req.user as any).username,
    });
    const safeUser: User = {
      id: user.id,
      name: user.name,
      username: user.username,
    };
    return safeUser;
  }


  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    return this.userService.user({ id });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findMany(): Promise<Paginated<User[]>> {
    return this.userService.users({});
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOne(@Body() body: Required<CreateUserDto>): Promise<User> {
    return this.userService.createUser(body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<User> {
    return this.userService.deleteUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async partialUpdateOne(
    @Param('id') id: string,
    @Body() body: UpdateUserDto
  ): Promise<User> {
    return this.userService.updateUser(
      {
        id,
      },
      body
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/password')
  async setPassword(
    @Param('id') id: string,
    @Body('password') password: string
  ): Promise<User> {
    return this.userService.resetPassword({ id }, password);
  }
}
