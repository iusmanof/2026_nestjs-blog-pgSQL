import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailerService) {}

  async sendConfirmationEmail(email: string, code: string): Promise<void> {
    await this.mailService.sendMail({
      to: email,
      subject: 'Registration submit',
      html: `
      <h1>Thank for your registration</h1>
      <p>
        To finish registration please follow the link below:
        <a href="https://somesite.com/confirm-email?code=${code}">
          complete registration
        </a>
      </p>
    `,
    });
  }
}
