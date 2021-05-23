import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGatewayAuthGuard extends AuthGuard('jwt-gateway') {}
