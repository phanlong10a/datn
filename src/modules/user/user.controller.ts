import { MailerService } from '@nestjs-modules/mailer';
import { HttpService } from '@nestjs/axios';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AxiosError } from 'axios';
import { randomUUID } from 'crypto';
import * as moment from 'moment';
import { catchError, firstValueFrom } from 'rxjs';
import { Auth, CurrentRequest, CurrentUser } from 'src/decorators/Authorization';
import { BaseSearchInput } from 'src/helpers/base-search.input';
import { BaseSearchResponse } from 'src/helpers/base-search.output';
import { PrismaService } from 'src/share_modules/prisma.service';
import { CreateUserInput } from './dto/create-user.dto';
import { EditUserInput } from './dto/edit-user.dto';
import { LoginInputDto } from './dto/login.dto';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('/')
export class UserController {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly mailerService: MailerService,
    private readonly prisma: PrismaService
  ) { }


  @Auth()
  @Get('api/user/profile')
  async profile(@CurrentUser('id') id: string) {
    return await this.userService.profile(id)
  }


  @Post('api/auth/login')
  async onLogin(@Body() input: LoginInputDto) {
    return await this.userService.login(input)
  }

  @Get('api/position/list-position')
  async getPosition() {
    return await this.userService.getPosition()
  }

  @Get('api/user/department')
  async getDepartment() {
    return await this.userService.getDepartment()
  }

  @Post('api/admin/list-user')
  async adminGetListUser(@Body() input: BaseSearchInput): Promise<BaseSearchResponse<UserDto>> {
    return await this.userService.listUser(input)
  }


  @Get('api/user/list-employee')
  async listEmployee(): Promise<BaseSearchResponse<UserDto>> {
    return await this.userService.listEmployee()
  }


  @Post('api/admin/create-employee')
  async createUsers(@Body() input: CreateUserInput): Promise<string> {
    return await this.userService.createUser(input)
  }

  @Post('api/admin/user/:id')
  async editUser(@Body() input: EditUserInput, @Param('id') id: string): Promise<string> {
    return await this.userService.editUser(input, id)
  }


  @Post('api/auth/forgot_password')
  async resetPassword(@Body() input: { email: string }, @CurrentRequest() currentRequest: any): Promise<string> {
    return await this.userService.resetPass(input, currentRequest?.headers?.origin)
  }
  @Post('/api/auth/reset_password')
  async resetPasswordWithToken(@Body() input: { email: string, password: string, token: string }, @CurrentRequest() currentRequest: any): Promise<string> {
    return await this.userService.resetPasswordWithToken(input)
  }

  @Auth()
  @Post('api/user/information')
  async editMySelf(@Body() input: EditUserInput, @CurrentUser('id') id: string): Promise<string> {
    return await this.userService.editUser(input, id)
  }

  @Auth()
  @Post('api/user/change-password')
  async changePass(@Body() input: {
    oldPassword: string;
    newPassword: string;
  }, @CurrentUser('id') id: string): Promise<string> {
    return await this.userService.changePass(input, id)
  }

  @Get('api/user/get-user/:id')
  async findUser(@Param('id') id: string): Promise<any> {
    return await this.userService.findUser(id)
  }

  @Delete('api/admin/user/:id')
  async delete(@Param('id') id: string): Promise<string> {
    return await this.userService.deleteUser(id)
  }


  @Get('zoom/meeting')
  async createMeeting() {
    const generateJWT = async () => {
      const id = randomUUID();
      const creation = new Date().getTime();
      const tokenExpiry = new Date().getTime() + 1000 * 60;
      const zoomApiSecret = "zH2IqUgYKPIkMl7oVnPwJkbyUhRFP8mmRX0z";

      const token = this.jwtService.sign({
        id
      }, {
        issuer: "VdKchwGgSzuAMu0hP2C4Ag",
        subject: '',
        expiresIn: '3d',
        notBefore: creation,
        audience: 'zoom',
        algorithm: 'HS256',
        secret: zoomApiSecret
      })
      return token
    }
    console.log("🚀 ~ file: user.controller.ts:99 ~ UserController ~ generateJWT ~ generateJWT", generateJWT())

    const apiUrl = "https://api.zoom.us/v2/users/" + "me" + "/meetings";
    const setting_body = {
      host_video: false,
      participant_video: true,
      join_before_host: false,
      mute_upon_entry: true,
      auto_recording: 'cloud',
    }
    const body = {

      agenda: "My Meeting",
      default_password: false,
      duration: 60,
      password: "123456",
      pre_schedule: false,
      recurrence: {
        end_date_time: "2022-04-02T15:59:00Z",
        end_times: 7,
        monthly_day: 1,
        monthly_week: 1,
        monthly_week_day: 1,
        repeat_interval: 1,
        type: 1,
        weekly_days: "1"
      },
      schedule_for: "phan.long.luxuri@gmail.com",
      settings: {
        allow_multiple_devices: true,
        approval_type: 2,
        audio: "telephony",
        auto_recording: "cloud",
        calendar_type: 1,
        close_registration: false,
        contact_email: "phan.long.luxuri@gmail.com",
        contact_name: "Long Phan",
        email_notification: true,
        encryption_type: "enhanced_encryption",
        focus_mode: true,
        host_video: false,
        jbh_time: 0,
        join_before_host: false,
        meeting_authentication: false,
        mute_upon_entry: false,
        participant_video: false,
        private_meeting: false,
        registrants_confirmation_email: true,
        registrants_email_notification: true,
        registration_type: 1,
        show_share_button: true,
        use_pmi: false,
        waiting_room: false,
        watermark: false,
        host_save_video_order: true,
        alternative_host_update_polls: true
      },
      start_time: moment().format(),
      template_id: "Dv4YdINdTk+Z5RToadh5ug==",
      topic: "My Meeting",
      type: 1
    }
    const { data }: any = await firstValueFrom(
      this.httpService.post<any[]>(apiUrl, body, {
        headers: {
          'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6IldMWlkyVV9MUjZxZTVEaU05Z1ZpOXciLCJleHAiOjE3MDAwNzAyNDAsImlhdCI6MTY3MzE5OTg5NX0.lFa6VOrePPnyCCWGlEEdU3NYlZyIO_xanxleemVCr5g',
          'content-type': 'application/json'
        }
      }).pipe(
        catchError((error: AxiosError) => {
          console.log("🚀 ~ file: user.controller.ts:140 ~ UserController ~ catchError ~ error", error)
          throw 'An error happened!';
        }),
      ),
    );
    console.log("🚀 ~ file: user.controller.ts:185 ~ UserController ~ createMeeting ~ data", data)
    const listMail = await this.prisma.user.findMany({
      select: {
        email: true
      }
    })
    await this.mailerService
      .sendMail({
        to: listMail.map((item) => item.email),
        from: 'noreply@nestjs.com',
        subject: 'Có cuộc họp ',
        text: 'Có cuộc họp, truy cập ngay tại' + data.join_url,
        html: `<b> Có cuộc họp, truy cập ngay tại ${data.join_url}</b>`, // HTML body content 
      })
    return data;
  }
}
