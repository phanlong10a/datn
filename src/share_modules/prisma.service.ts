import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { DEFAULT_DATABASE } from 'src/helpers/constant';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();

    const initUser = await this.user.count();
    if (!initUser) {
      await this.user.createMany({
        data: [
          {
            email: DEFAULT_DATABASE.SUPER_ADMIN_ACCOUNT.EMAIL,
            isAdmin: true,
            password: bcrypt.hashSync(
              DEFAULT_DATABASE.SUPER_ADMIN_ACCOUNT.PASSWORD,
              10,
            ),
          },
        ],
      });
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
