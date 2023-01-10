import {
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as JwksClient from 'jwks-rsa';
import { ErrorService } from 'src/share_modules/errors/error.service';
import { PrismaService } from 'src/share_modules/prisma.service';

interface UserInfoSocial {
  facebook_id?: number;
  google?: {
    id?: number | string;
    email?: string;
  };
}

@Injectable()
export class AuthService {
  private jwks: JwksClient.JwksClient = JwksClient({
    jwksUri: 'https://appleid.apple.com/auth/keys',
  });

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly error: ErrorService,
  ) { }

  async refresh(refreshToken: string, type: number) {
    const decode = this.jwtService.verify(refreshToken, {
      secret: this.configService.get<string>('jwt.refreshToken.secret'),
    });
    if (!decode) throw new UnauthorizedException();
    const user = await this.prismaService.user.findUnique({
      where: {
        id: decode.id,
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    const token = this.generateAccessToken(user.id);
    const refresh_token = this.generateRefreshToken(user.id);
    return {
      token,
      refresh_token,
    };
  }


  generateAccessToken(userId: number | string) {
    const accessToken = this.jwtService.sign(
      { id: userId },
      {
        expiresIn: this.configService.get<string>('jwt.accessToken.expired'),
        secret: this.configService.get<string>('jwt.accessToken.secret'),
      },
    );

    return accessToken;
  }

  generateRefreshToken(userId: number | string) {
    const refreshToken = this.jwtService.sign(
      { id: userId },
      {
        expiresIn: this.configService.get<string>('jwt.refreshToken.expired'),
        secret: this.configService.get<string>('jwt.refreshToken.secret'),
      },
    );

    return refreshToken;
  }
}
