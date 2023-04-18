import { BadRequestException, Injectable } from '@nestjs/common';
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
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashing: HashingService,
    private readonly auth: AuthService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async profile(id: string) {
    if (!id) throw new BadRequestException('Dịch vụ không khả dụng');
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    console.log(
      '🚀 ~ file: user.service.ts:36 ~ UserService ~ profile ~ user',
      user,
    );
    return {
      data: user,
    };
  }

  async findUser(id: string) {
    const data = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });
    return { data };
  }

  async login(input: LoginInputDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: input.email,
      },
    });
    if (!user) throw new BadRequestException('Tài khoản không tồn tại');
    const isCorrect = await this.hashing.match(input.password, user.password);
    if (!isCorrect) throw new BadRequestException('Sai mật khẩu');
    const token = await this.auth.generateAccessToken(user.id);
    const refreshToken = await this.auth.generateRefreshToken(user.id);
    return {
      email: user.email,
      fullName: user.fullName,
      id: user.id,
      isAdmin: user.isAdmin,
      token,
      refreshToken,
    };
  }

  async resetPass(input: { email: string }, host: string): Promise<string> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: input.email,
      },
    });
    if (!user) throw new BadRequestException('Tài khoản không tồn tại');

    const randomOtp = Math.floor(100000 + Math.random() * 900000);
    const token = this.auth.generateAccessToken(user.id);

    await this.mailerService.sendMail({
      to: [user.email],
      from: 'noreply@nestjs.com',
      subject: 'Lấy lại mật khẩu',
      text: 'Lấy lại mật khẩu',
      html: `
          <div>
            <div>
              <h2>
                Bấm vào đường link <b><a href="${host}/reset-pass/${user.email}/${token}" target="_blank"> Tại đây</a></b>để lấy lại mật khẩu
              </h2>
            </div>
          </div>
        `, // HTML body content
    });

    try {
      await this.prisma.refresh_password.create({
        data: {
          otp: randomOtp,
          user_token: token,
        },
      });
    } catch (error) {
      throw new BadRequestException('Có lỗi xảy ra');
    }

    return 'Thành công, đường link lấy lại mật khẩu sẽ được gửi đến mail của bạn trong ít phút';
  }

  async resetPasswordWithToken(input: {
    email: string;
    password: string;
    token: string;
  }): Promise<string> {
    const verify = await this.jwtService.verify(input.token, {
      secret: this.config.get<string>('jwt.accessToken.secret'),
    });
    if (!verify.id) throw new BadRequestException('Quá hạn đổi mật khaaur');
    const user = await this.prisma.user.findUnique({
      where: {
        id: verify.id,
      },
    });
    if (user.email !== input.email)
      throw new BadRequestException('Tài khoản không tồn tại');

    const newPassword = await this.hashing.hash(input.password);
    try {
      await this.prisma.user.update({
        where: {
          id: verify.id,
        },
        data: {
          password: newPassword,
        },
      });
    } catch (error) {
      throw new BadRequestException('Có lỗi xảy ra');
    }
    return 'Thành công';
  }

  async listUser(input: BaseSearchInput): Promise<BaseSearchResponse<UserDto>> {
    console.log(
      '🚀 ~ file: user.service.ts:159 ~ UserService ~ listUser ~ input:',
      input,
    );
    const countUser = await this.prisma.user.count({
      where: {
        AND: [
          {
            OR: [
              {
                email: {
                  not: DEFAULT_DATABASE.SUPER_ADMIN_ACCOUNT.EMAIL,
                  contains: input.search_text,
                },
              },
              {
                phone: { contains: input.search_text },
              },
            ],
          },
          {
            deleted: false,
          },
        ],
      },
    });

    const listUser = await this.prisma.user.findMany({
      skip: input.size * input.page,
      take: input.size,
      where: {
        AND: [
          {
            OR: [
              {
                email: {
                  not: DEFAULT_DATABASE.SUPER_ADMIN_ACCOUNT.EMAIL,
                  contains: input.search_text,
                },
              },
              {
                phone: { contains: input.search_text },
              },
              {
                fullName: { contains: input.search_text },
              },
            ],
          },
          {
            deleted: false,
          },
        ],
      },
    });

    return {
      total: countUser,
      data: listUser.map((item) => {
        return {
          ...item,
          created_at: moment(item.created_at).toISOString(),
          updated_at: moment(item.updated_at).toISOString(),
        };
      }),
    };
  }

  async createUser(input: CreateUserInput): Promise<string> {
    const countUser = await this.prisma.user.count();
    const findUser = await this.prisma.user.findFirst({
      where: {
        email: input.email,
        deleted: false,
      },
    });
    if (!!findUser) throw new BadRequestException('Email đã tồn tại');

    const password = await this.hashing.hash('12345678');
    const staffCode = 'STAFF' + countUser;

    await this.prisma.user.create({
      data: {
        ...input,
        password,
        staffCode,
      },
    });

    return 'Tạo tài khoản thành công';
  }

  async editUser(input: EditUserInput, id: string): Promise<string> {
    const findUser = await this.prisma.user.findFirst({
      where: {
        email: input.email,
        deleted: false,
        id: {
          not: id,
        },
      },
    });
    if (!!findUser) throw new BadRequestException('Email đã tồn tại');

    await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        ...input,
      },
    });

    return 'Cập nhật tài khoản thành công';
  }

  async changePass(
    input: {
      oldPassword: string;
      newPassword: string;
    },
    id: string,
  ): Promise<string> {
    const findUser = await this.prisma.user.findFirst({
      where: {
        id: id,
      },
    });
    if (!findUser) throw new BadRequestException('Tài khoản không tồn tại');

    const compare = await this.hashing.match(
      input.oldPassword,
      findUser.password,
    );
    if (!compare) throw new BadRequestException('Mật khẩu cũ không đúng');
    const hash = await this.hashing.hash(input.newPassword);
    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password: hash,
      },
    });
    return 'Cập nhật tài khoản thành công';
  }

  async deleteUser(id: string): Promise<string> {
    await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        deleted: true,
      },
    });

    return 'Xoá tài khoản thành công';
  }
}
