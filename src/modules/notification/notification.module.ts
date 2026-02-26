import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'igralex1@gmail.com',
          pass: 'cflaskpbmzyhkdyx',
        },
      },
      defaults: {
        from: `"Sprint 2" <igralex1@gmail.com>`,
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class NotificationModule {}
