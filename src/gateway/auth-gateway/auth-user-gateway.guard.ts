import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthSocket } from '../type/auth-socket';

@Injectable()
export class AuthUserGatewayGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient<AuthSocket>();
    return !!(client.user && client.user.id);
  }
}
