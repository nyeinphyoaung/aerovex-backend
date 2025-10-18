import { Module } from '@nestjs/common';
import { EmailModule } from './email/email.module';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    EmailModule,
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
        },
        defaultJobOptions: {
          attempts: configService.get<number>('QUEUE_DEFAULT_ATTEMPTS', 3),
          removeOnComplete: configService.get<boolean>(
            'QUEUE_REMOVE_ON_COMPLETE',
            true,
          ),
          removeOnFail: configService.get<boolean>(
            'QUEUE_REMOVE_ON_FAIL',
            false,
          ),
          backoff: {
            type: 'exponential',
            delay: configService.get<number>('QUEUE_BACKOFF_DELAY', 5000),
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class QueuesModule {}
