import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { QUEUE_NAME } from '../constants/queue.constants';
import { Queue } from 'bullmq';
import { EmailJobName, WelcomeEmailJobPayload } from '../types/email-job.types';

@Injectable()
export class EmailService {
  constructor(
    @InjectQueue(QUEUE_NAME.EMAIL_QUEUE) private readonly emailQueue: Queue,
  ) {}

  async addWelcomeEmailJob(payload: WelcomeEmailJobPayload): Promise<void> {
    await this.emailQueue.add(EmailJobName.WELCOME_EMAIL, payload);
  }
}
