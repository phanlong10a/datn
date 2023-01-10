import { forwardRef, Module } from '@nestjs/common';
import { UploadServiceService } from './upload-service.service';
import { ErrorService } from 'src/share_modules/errors/error.service';
import { PrismaService } from 'src/share_modules/prisma.service';
import { ConfigService } from '@nestjs/config';
import { UploadServiceController } from './upload-service.controller';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => UserModule), AuthModule],
  providers: [
    UploadServiceService,
    ErrorService,
    PrismaService,
    ConfigService,
  ],
  controllers: [UploadServiceController],
  exports: [UploadServiceService],
})
export class UploadServiceModule { }
