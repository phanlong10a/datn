import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import configuration from './share_modules/config/configuration';
import { validate } from './share_modules/config/validate.config';
import { SharedModule } from './share_modules/share.module';
import { MedicineModule } from './modules/medicine/medicine.module';
import { PrescriptionModule } from './modules/prescription/prescription.module';
import { PatientModule } from './modules/patient/patient.module';
import { ReceiptModule } from './modules/receipt/receipt.module';
import { LoginModule } from './login/login.module';

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
    MedicineModule,
    PrescriptionModule,
    PatientModule,
    ReceiptModule,
    LoginModule,
  ],
  // providers: [FirebaseService],
})
export class AppModule {}
