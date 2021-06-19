import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, SizeRule } from '@prisma/client';

@Injectable()
export class SizeRuleService {
  constructor(private prisma: PrismaService) {}

  async findMany<T extends Prisma.SizeRuleFindManyArgs>(
    params: Prisma.SelectSubset<T, Prisma.SizeRuleFindManyArgs>,
  ): Promise<
    Prisma.CheckSelect<
      T,
      Promise<SizeRule[]>,
      Promise<Prisma.SizeRuleGetPayload<T, keyof T>[]>
    >
  > {
    return this.prisma.sizeRule.findMany(params);
  }
}
