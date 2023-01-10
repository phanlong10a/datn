import { GoogleMapService } from './googlemap.service';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ErrorService } from './errors/error.service';
import { FirebaseService } from './firebase.service';
import { HashingService } from './hashing.service';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [
    PrismaService,
    ConfigService,
    ErrorService,
    HashingService,
    FirebaseService,
  ],
  imports: [ConfigModule],
  exports: [
    PrismaService,
    ConfigService,
    ErrorService,
    HashingService,
    FirebaseService,
  ],
})
export class SharedModule { }
