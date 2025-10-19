import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    // this.$use(softDeleteMiddleware);
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
