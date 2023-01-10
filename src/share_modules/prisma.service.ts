import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, ROLE } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { DEFAULT_DATABASE } from 'src/helpers/constant';
import * as nationJson from '../helpers/nation.json';
import * as organiazionJson from '../helpers/organization.json';
import { MEET_PARAMETER } from './../helpers/constant';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();

    const initDepartment = await this.department.count()
    if (!initDepartment) {
      await this.department.createMany({
        data: [{
          name: 'Phòng ban hành chính',
        },
        {
          name: 'Phòng ban quản trị',
        },
        {
          name: 'Phòng ban phát triển sản phẩm',
        }, {
          name: 'Phòng ban marketing',
        }
        ],
      });
    }

    const initPosition = await this.position.count()
    if (!initPosition) {
      await this.position.createMany({
        data: [{
          name: 'Thực tập',
          cost_salary: 3000000,
          bonus_salary: 0,
          is_insurance: false
        },
        {
          name: 'Nhân viên chính thức',
          cost_salary: 5000000,
          bonus_salary: 0,
          is_insurance: true
        }, {
          name: 'Nhân sự cấp cao',
          cost_salary: 5000000,
          bonus_salary: 6000000,
          is_insurance: true
        }, {
          name: 'Nhân sự quản lý',
          cost_salary: 5000000,
          bonus_salary: 10000000,
          is_insurance: true
        },
        {
          name: 'Giám đốc',
          cost_salary: 10000000,
          bonus_salary: 10000000,
          is_insurance: true
        },
        ],
      });
    }

    const initUser = await this.user.count()
    if (!initUser) {
      await this.user.createMany({
        data: [{
          email: DEFAULT_DATABASE.SUPER_ADMIN_ACCOUNT.EMAIL,
          password: bcrypt.hashSync(DEFAULT_DATABASE.SUPER_ADMIN_ACCOUNT.PASSWORD, 10),
          role: ROLE.ADMIN
        }],
      });
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
