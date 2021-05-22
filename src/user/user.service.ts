import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user<T extends Prisma.UserFindUniqueArgs>(
    params: Prisma.SelectSubset<T, Prisma.UserFindUniqueArgs>,
  ): Promise<
    Prisma.CheckSelect<
      T,
      Promise<User>,
      Promise<Prisma.UserGetPayload<T, keyof T>>
    >
  > {
    return this.prisma.user.findUnique(params);
  }

  async upsertUser<T extends Prisma.UserUpsertArgs>(
    params: Prisma.SelectSubset<T, Prisma.UserUpsertArgs>,
  ): Promise<
    Prisma.CheckSelect<
      T,
      Promise<User>,
      Promise<Prisma.UserGetPayload<T, keyof T>>
    >
  > {
    return this.prisma.user.upsert(params);
  }
}
