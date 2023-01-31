import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import configuration from './share_modules/config/configuration';
import { validate } from './share_modules/config/validate.config';
import { SharedModule } from './share_modules/share.module';
import { PositionModule } from './modules/position/position.module';
import { DepartmentModule } from './modules/department/department.module';
import { PolicyModule } from './modules/policy/policy.module';
import { NewsModule } from './modules/news/news.module';
import { CheckinModule } from './modules/checkin/checkin.module';
import { TestModelModule } from './modules/test-model/test-model.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env'],
      validationSchema: validate,
      validationOptions: {
        abortEarly: true,
      },
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_SERVER,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      },
    }),
    ScheduleModule.forRoot(),
    SharedModule,
    UserModule,
    AuthModule,
    PositionModule,
    DepartmentModule,
    PolicyModule,
    NewsModule,
    CheckinModule,
    TestModelModule,
  ],
  // providers: [FirebaseService],
})
export class AppModule { }
