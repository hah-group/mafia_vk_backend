import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { VkIoService } from '../vk-io/vk-io.service';
import { UsersUserFull } from 'vk-io/lib/api/schemas/objects';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private vk: VkIoService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

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

  async getUserInfo(id: string): Promise<UsersUserFull> {
    const users = await this.vk.api.users.get({
      user_ids: id,
      fields: ['photo_100'],
      lang: 0,
    });
    return users[0];
  }

  async auth(user_id: string): Promise<User> {
    const { id, first_name, last_name, photo_100 } = await this.getUserInfo(
      user_id,
    );

    return this.userService.upsertUser({
      where: {
        id: id,
      },
      create: {
        id: id,
        first_name: first_name,
        last_name: last_name,
        avatar_src: photo_100,
      },
      update: {
        first_name: first_name,
        last_name: last_name,
        avatar_src: photo_100,
      },
    });
  }

  createToken(user: User): string {
    const payload = { sub: user.id, name: user.first_name };
    return this.jwtService.sign(payload);
  }
}
