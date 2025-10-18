import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { BullModule } from '@nestjs/bullmq';
import { EmailProcessor } from './email.processor';
import { QUEUE_NAME } from '../constants/queue.constants';
import { ExternalServiceModule } from 'src/external-service/external-service.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUE_NAME.EMAIL_QUEUE,
    }),
    ExternalServiceModule,
  ],
  providers: [EmailService, EmailProcessor],
  exports: [EmailService],
})
export class EmailModule {}
