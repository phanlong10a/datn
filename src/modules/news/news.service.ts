import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { BaseSearchInput } from 'src/helpers/base-search.input';
import { BaseSearchResponse } from 'src/helpers/base-search.output';
import { PrismaService } from 'src/share_modules/prisma.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { NewsDto } from './dto/news.dto';

@Injectable()
export class NewsService {

  constructor(private readonly prisma: PrismaService,
    private readonly mailerService: MailerService) {
  }

  async getList(input: BaseSearchInput): Promise<BaseSearchResponse<NewsDto>> {
    const total = await this.prisma.news.count({
      where: {
        title: { contains: input.search_text },
      },
    })
    const data = await this.prisma.news.findMany({
      skip: input.size * (input.page - 1),
      take: input.size,
      where: {
        title: { contains: input.search_text },
      },
    })

    return {
      total,
      data: data.map((item) => {
        return {
          ...item,
          created_at: moment(item.created_at).toISOString(),
          updated_at: moment(item.updated_at).toISOString()
        }
      })
    }
  }
  async getListU(): Promise<BaseSearchResponse<NewsDto>> {
    const total = await this.prisma.news.count()
    const data = await this.prisma.news.findMany()

    return {
      total,
      data: data.map((item) => {
        return {
          ...item,
          created_at: moment(item.created_at).toISOString(),
          updated_at: moment(item.updated_at).toISOString()
        }
      })
    }
  }

  async create(input: CreateNewsDto): Promise<string> {
    const listMail = await this.prisma.user.findMany({
      select: {
        email: true
      }
    })
    await this.mailerService
      .sendMail({
        to: listMail.map((item) => item.email),
        from: 'noreply@nestjs.com',
        subject: input.title,
        text: input.title,
        html: `<b>${input.content}</b>`, // HTML body content 
      })
    await this.prisma.news.create({
      data: {
        ...input
      }
    })
    return 'Thành công'
  }

  async update(input: CreateNewsDto, id: string): Promise<string> {
    await this.prisma.news.update({
      where: {
        id
      },
      data: {
        ...input
      }
    })
    return 'Thành công'
  }

  async delete(id: string): Promise<string> {
    await this.prisma.news.delete({
      where: {
        id
      }
    })
    return 'Thành công'
  }
}
