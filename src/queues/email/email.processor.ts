import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { EmailPohService } from 'src/external-service/email-poh';
import { QUEUE_NAME } from '../constants/queue.constants';
import { EmailJobName, WelcomeEmailJobPayload } from '../types/email-job.types';

@Processor(QUEUE_NAME.EMAIL_QUEUE)
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly emailPohService: EmailPohService) {
    super();
  }

  async process(job: Job<WelcomeEmailJobPayload>): Promise<any> {
    this.logger.log(
      `Processing job ${job.name} with ID ${job.id} (Attempt ${job.attemptsMade + 1})`,
    );

    try {
      switch (job.name as EmailJobName) {
        case EmailJobName.WELCOME_EMAIL: {
          await this.emailPohService.welcomeEmail(job.data);
          this.logger.log(`Successfully processed job ${job.id}`);
          return { success: true, processedAt: new Date().toISOString() };
        }

        default: {
          const error = new Error(`Unknown job type: ${job.name}`);
          this.logger.error(`Job ${job.id} failed: ${error.message}`);
          throw error;
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to process job ${job.id} (${job.name}): ${errorMessage}`,
        errorStack,
      );
      throw error;
    }
  }
}
