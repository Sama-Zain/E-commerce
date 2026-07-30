import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { promises } from 'dns';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(private readonly mailerService: MailerService) {}

  async sendVervicationOtp(email: string, otp: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: ` your account Activation Code`,
        template: `./otp`,
        context: { confirmEmailOtp: otp },
      });
      this.logger.log(`Verification OTP sent to ${email} successfully`);
    } catch (error) {
      console.error(error);
      this.logger.error(error);
    }
  }
}
