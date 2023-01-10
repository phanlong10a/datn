
import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { BaseSearchInput } from 'src/helpers/base-search.input';
import { BaseSearchResponse } from 'src/helpers/base-search.output';
import { DEFAULT_DATABASE } from 'src/helpers/constant';
import { HashingService } from 'src/share_modules/hashing.service';
import { PrismaService } from 'src/share_modules/prisma.service';
import { AuthService } from '../auth/services/auth.service';
import { LoginInputDto } from './dto/login.dto';
import { UserDto } from './dto/user.dto';
import * as moment from 'moment';
import { CreateUserInput } from './dto/create-user.dto';
import { EditUserInput } from './dto/edit-user.dto';
import { ROLE } from '@prisma/client';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashing: HashingService,
    private readonly auth: AuthService,
  ) { }


  async profile(id: string) {
    if (!id) throw new BadRequestException("Dịch vụ không khả dụng")
    const user = await this.prisma.user.findUnique({
      where: {
        id
      }
    })
    return {
      data: user
    }
  }

  async getPosition() {
    const data = await this.prisma.position.findMany()
    return data
  }

  async getDepartment() {
    const data = await this.prisma.department.findMany()
    return data
  }
  async findUser(id: string) {
    const data = await this.prisma.user.findFirst({
      where: {
        id
      }
    })
    return { data }
  }

  async login(input: LoginInputDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: input.email,
      },
    })
    if (!user) throw new BadRequestException('Tài khoản không tồn tại')
    const isCorrect = await this.hashing.match(input.password, user.password)
    if (!isCorrect) throw new BadRequestException('Sai mật khẩu')
    const token = await this.auth.generateAccessToken(user.id)
    const refreshToken = await this.auth.generateRefreshToken(user.id)
    return {
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      id: user.id,
      token,
      refreshToken,
    }
  }


  async listUser(input: BaseSearchInput): Promise<BaseSearchResponse<UserDto>> {
    const countUser = await this.prisma.user.count({
      where: {
        email: {
          not: DEFAULT_DATABASE.SUPER_ADMIN_ACCOUNT.EMAIL,
          contains: input.search_text
        },
        deleted: false
      }
    })

    const listUser = await this.prisma.user.findMany({
      skip: input.size * (input.page - 1),
      take: input.size,
      where: {
        email: { contains: input.search_text },
        deleted: false
      },
      include: {
        department: true,
        position: true,
        checkin_logs: true
      }
    })

    return {
      total: countUser,
      data: listUser.map((item) => {
        return {
          ...item,
          created_at: moment(item.created_at).toISOString(),
          updated_at: moment(item.updated_at).toISOString()
        }
      })
    }
  }

  async listEmployee(): Promise<BaseSearchResponse<UserDto>> {
    const countUser = await this.prisma.user.count({
      where: {
        email: {
          not: DEFAULT_DATABASE.SUPER_ADMIN_ACCOUNT.EMAIL,
        },
        deleted: false,
        role: {
          not: ROLE.ADMIN,
        }
      }
    })

    const listUser = await this.prisma.user.findMany({
      where: {
        deleted: false,
        role: {
          not: ROLE.ADMIN,
        }
      },
      include: {
        department: true,
        position: true,
        checkin_logs: true
      }
    })

    return {
      total: countUser,
      data: listUser.map((item) => {
        return {
          ...item,
          created_at: moment(item.created_at).toISOString(),
          updated_at: moment(item.updated_at).toISOString()
        }
      })
    }
  }


  async createUser(input: CreateUserInput): Promise<string> {
    const countUser = await this.prisma.user.count()
    const findUser = await this.prisma.user.findFirst({
      where: {
        email: input.email,
        deleted: false
      },
    })
    if (!!findUser) throw new BadRequestException('Email đã tồn tại')

    const password = await this.hashing.hash('12345678')
    const staffCode = 'STAFF' + countUser


    await this.prisma.user.create({
      data: {
        ...input,
        password,
        staffCode
      }
    })

    return 'Tạo tài khoản thành công'
  }

  async editUser(input: EditUserInput, id: string): Promise<string> {
    const findUser = await this.prisma.user.findFirst({
      where: {
        email: input.email,
        deleted: false,
        id: {
          not: id
        }
      },
    })
    if (!!findUser) throw new BadRequestException('Email đã tồn tại')

    await this.prisma.user.update({
      where: {
        id: id
      },
      data: {
        ...input
      }
    })

    return 'Cập nhật tài khoản thành công'
  }


  async changePass(input: {
    oldPassword: string;
    newPassword: string;
  }, id: string): Promise<string> {
    const findUser = await this.prisma.user.findFirst({
      where: {
        id: id
      },
    })
    if (!findUser) throw new BadRequestException('Tài khoản không tồn tại')

    const compare = await this.hashing.match(input.oldPassword, findUser.password)
    if (!compare) throw new BadRequestException('Mật khẩu cũ không đúng')
    const hash = await this.hashing.hash(input.newPassword)
    await this.prisma.user.update({
      where: {
        id
      },
      data: {
        password: hash
      }
    })
    return 'Cập nhật tài khoản thành công'
  }

  async deleteUser(id: string): Promise<string> {
    await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        deleted: true
      }
    })

    return 'Xoá tài khoản thành công'
  }
}
