import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { BaseSearchInput } from 'src/helpers/base-search.input';
import { BaseSearchResponse } from 'src/helpers/base-search.output';
import { PrismaService } from 'src/share_modules/prisma.service';
import { CreatePositionInput } from './dto/create-position.dto';
import { PositionDto } from './dto/position.dto';

@Injectable()
export class PositionService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async getList(input: BaseSearchInput): Promise<BaseSearchResponse<PositionDto>> {
    const total = await this.prisma.position.count({
      where: {
        name: { contains: input.search_text },
      },
    })
    const data = await this.prisma.position.findMany({
      skip: input.size * (input.page - 1),
      take: input.size,
      where: {
        name: { contains: input.search_text },
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

  async create(input: CreatePositionInput): Promise<string> {
    await this.prisma.position.create({
      data: {
        ...input
      }
    })
    return 'Thành công'
  }

  async update(input: CreatePositionInput, id: string): Promise<string> {
    await this.prisma.position.update({
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
    await this.prisma.position.delete({
      where: {
        id
      }
    })
    return 'Thành công'
  }
}
