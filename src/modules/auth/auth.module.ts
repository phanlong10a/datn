import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { FacebookAuthModule } from 'facebook-auth-nestjs';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './services/auth.service';
import { GoogleAuthService } from './services/googole-auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    FacebookAuthModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        clientId: configService.get<number>('facebook.clientId') as number,
        clientSecret: configService.get<string>(
          'facebook.clientSecret',
        ) as string,
      }),
    }),
    JwtModule.register({}),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy, GoogleAuthService],
  exports: [AuthService, AuthResolver, JwtStrategy],
})
export class AuthModule {}
