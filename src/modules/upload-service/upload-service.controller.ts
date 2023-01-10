import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { Auth } from 'src/decorators/Authorization';
import * as path from 'path';
import * as dayjs from 'dayjs';
import * as fs from 'fs';
import { convertFileName, getNewestFile } from 'src/helpers/utils';
import { UserService } from '../user/user.service';
import { UploadServiceService } from './upload-service.service';
import { PrismaService } from 'src/share_modules/prisma.service';

@Controller('/')
export class UploadServiceController {
  constructor(
    private readonly config: ConfigService,
    private readonly upload: UploadServiceService,
    private readonly user: UserService,
    private readonly prisma: PrismaService,
  ) { }

  @Post('upload-service/file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: convertFileName,
      }),
    }),
  )
  handleUpload(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ): any {
    if (file) {
      return {
        url: req.headers.host,
        path: req.headers.host + '/' + file.path,
      };
    }
    throw new BadRequestException();
  }

}
