import { Module } from '@nestjs/common';
import { AuthService } from './Auth.service';
import { AuthController } from './Auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModel } from 'src/DB/Models/user.model';
import { MailModule } from 'src/mail/mail.module';
import { TokenService } from 'src/common/services/Token.service';
import { JwtModule } from '@nestjs/jwt';
import { CommonModule } from 'src/common/commonModule/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'config/dev.env' }),
    UserModel,
    MailModule,
    CommonModule, // ← بدل JwtModule.registerAsync المباشر
  ],
  controllers: [AuthController],
  providers: [AuthService], // TokenService جاي من CommonModule دلوقتي
})
export class AuthModule {}
