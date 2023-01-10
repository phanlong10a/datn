import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as firebase from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firebaseInstance: firebase.app.App;
  constructor(
    private readonly configService: ConfigService,
  ) { }

  async onModuleInit() {
    const firebaseConfig: any = this.configService.get('firebase');
    if (this.firebaseInstance === null || this.firebaseInstance === undefined) {
      this.firebaseInstance = firebase.initializeApp({
        credential: firebase.credential.cert(firebaseConfig),
      });
    }
  }

  async sendBatch(devices: string[], title: string, body: string) {
    return this.firebaseInstance
      .messaging()
      .sendToDevice(devices, { notification: { title, body } });
  }
  async sendMulticast(devices: string[], title: string, body: string) {
    return this.firebaseInstance
      .messaging()
      .sendMulticast({
        tokens: devices,
        data: {
          notifee: JSON.stringify({
            body,
            android: {
              channelId: 'default',
              actions: [
                {
                  title,
                  pressAction: {
                    id: 'read',
                  },
                },
              ],
            },
          }),
        }
      });
  }
}
