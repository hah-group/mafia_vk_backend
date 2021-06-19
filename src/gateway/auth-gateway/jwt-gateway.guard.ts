import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { AuthSocket } from '../type/auth-socket';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtBodyDto } from '../../auth/dto/jwt-body.dto';

@Injectable()
export class JwtGatewayGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<AuthSocket>();
    if (client.user && client.user.id) return true;

    const data = context.switchToWs().getData<LoginAuthDto>();
    let fromToken: JwtBodyDto;

    try {
      fromToken = this.jwtService.verify<JwtBodyDto>(data.access_token);
    } catch (e) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.user({
      where: {
        id: fromToken.sub,
      },
    });

    if (user) context.switchToWs().getClient<AuthSocket>().user = user;

    return !!user;
  }
}
