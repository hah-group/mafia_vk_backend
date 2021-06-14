import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AppAuthGuard } from './app-auth.guard';
import { AppAuthQueryDto } from './dto/app-auth-query.dto';
import { AuthService } from './auth.service';
import { AppAuthResponseDto } from './dto/app-auth-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AppAuthGuard)
  @Get('app')
  async app(@Query() query: AppAuthQueryDto): Promise<AppAuthResponseDto> {
    const user = await this.authService.auth(query.vk_user_id);
    return {
      access_token: this.authService.createToken(user),
    };
  }
}
