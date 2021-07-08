import { Controller, Get, Logger, Query } from '@nestjs/common';
import { AppAuthQueryDto } from './dto/app-auth-query.dto';
import { AuthService } from './auth.service';
import { AppAuthResponseDto } from './dto/app-auth-response.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger('Auth');

  constructor(private authService: AuthService) {}

  /*@UseGuards(AppAuthGuard)*/
  @Get('app')
  async app(@Query() query: AppAuthQueryDto): Promise<AppAuthResponseDto> {
    this.logger.log('Авторизация приложения');
    const user = await this.authService.auth(query.vk_user_id);
    return {
      access_token: this.authService.createToken(user),
    };
  }
}
