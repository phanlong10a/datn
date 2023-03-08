import { forwardRef, Module } from '@nestjs/common';
import { ErrorService } from 'src/share_modules/errors/error.service';
import { AuthModule } from '../auth/auth.module';
import { UploadServiceModule } from '../upload-service/upload-service.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    AuthModule,
    forwardRef(() => UploadServiceModule),
    JwtModule.register({}),
    HttpModule,
  ],
  providers: [UserService, ErrorService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
