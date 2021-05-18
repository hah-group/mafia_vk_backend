import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  validateSign(params: string, sign: string): boolean {
    const paramsHash = crypto
      .createHmac('sha256', process.env.APP_SECRET_KEY)
      .update(params)
      .digest()
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=$/, '');

    return paramsHash === sign;
  }
}
