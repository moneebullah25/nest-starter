import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['error', 'warn'],
    });
    if (!process.env.DATABASE_URL) {
      const host = process.env.DATABASE_HOST || 'localhost';
      const port = process.env.DATABASE_PORT || '5432';
      const username = process.env.DATABASE_USERNAME || 'postgres';
      const password = process.env.DATABASE_PASSWORD || 'postgres';
      const db = process.env.DATABASE_NAME || 'starter';

      process.env.DATABASE_URL = `postgresql://${username}:${password}@${host}:${port}/${db}`;
      console.log(
        `✅ DATABASE_URL dynamically generated: ${process.env.DATABASE_URL}`,
      );
    }
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
