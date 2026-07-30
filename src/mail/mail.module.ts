import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EjsAdapter } from '@nestjs-modules/mailer/adapters/ejs.adapter';
import { join } from 'path/win32';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          service: `gmail`,
          auth: {
            user: configService.get<string>(`MAIL-USER`),
            pass: configService.get<string>(`MAIL-PASS`),
          },
        },
        defaults: {
          from: `"No Reply" <${configService.get<string>(`MAIL-USER`)}>`,
        },
        template: {
          dir: join(__dirname, `templates`),
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
