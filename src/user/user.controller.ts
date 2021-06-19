import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserInterface } from './user.interface';

@Controller('user')
export class UserController {
  @Get('get')
  @UseGuards(JwtAuthGuard)
  get(@Request() req): UserInterface {
    const { vk_access_token, ...user } = req.user;
    return user;
  }
}
