import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Auth, google } from 'googleapis';

@Injectable()
export class GoogleAuthService implements OnModuleInit {
  private oauthGoogleClient: Auth.OAuth2Client;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.oauthGoogleClient = new google.auth.OAuth2({
      clientId: this.configService.get('google.clientId'),
      clientSecret: this.configService.get('google.clientSecret'),
    });
  }

  async getUser(accessToken: string) {
    this.oauthGoogleClient.setCredentials({
      access_token: accessToken,
    });

    const oauth2 = google.oauth2({
      auth: this.oauthGoogleClient,
      version: 'v2',
    });

    const { data } = await oauth2.userinfo.get();

    return data;
  }
}
