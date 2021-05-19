import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { stringify } from 'qs';
import { AuthService } from './auth.service';

@Injectable()
export class AppAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { sign, ...query } = context
      .switchToHttp()
      .getRequest<Request>().query;

    const vk_query = {};
    Object.entries(query).forEach(([key, value]) => {
      if (key.match(/^vk_/i) !== null) vk_query[key] = value;
    });

    return this.authService.validateSign(
      stringify(vk_query, { encode: false }),
      String(sign),
    );
  }
}
