import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { Socket } from 'socket.io';

@Injectable()
export class JwtGatewayStrategy extends PassportStrategy(
  Strategy,
  'jwt-gateway',
) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: (client: Socket) => client.handshake.query.access_token,
      ignoreExpiration: false,
      secretOrKey: process.env.APP_SECRET_KEY,
    });
  }

  async validate(payload: any) {
    return await this.userService.user({
      where: {
        id: payload.sub,
      },
    });
  }
}
