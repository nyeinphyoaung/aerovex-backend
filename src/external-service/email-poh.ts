import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { WelcomeEmailJobPayload } from 'src/queues/types/email-job.types';

@Injectable()
export class EmailPohService {
  private readonly logger = new Logger(EmailPohService.name);

  constructor(private readonly mailerService: MailerService) {}

  async welcomeEmail(data: WelcomeEmailJobPayload): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: data.to,
        subject: `Welcome to AeroVex, ${data.name}!`,
        template: 'welcome',
        context: {
          name: data.name,
          verificationUrl: data.verificationUrl,
        },
      });
      this.logger.log(`Welcome email sent successfully to ${data.to}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to send welcome email to ${data.to}: ${errorMessage}`,
        errorStack,
      );
      throw error;
    }
  }
}
