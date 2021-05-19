import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(params: { where: Prisma.UserWhereUniqueInput }): Promise<User> {
    return this.prisma.user.findUnique(params);
  }

  upsertUser(params: {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.UserCreateInput;
    update: Prisma.UserUpdateInput;
  }) {
    return this.prisma.user.upsert(params);
  }
}
