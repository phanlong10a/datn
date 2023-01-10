import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { BaseSearchInput } from 'src/helpers/base-search.input';
import { BaseSearchResponse } from 'src/helpers/base-search.output';
import { PrismaService } from 'src/share_modules/prisma.service';
import { CreateDepartmentInput } from './dto/create-department.dto';
import { DepartmentDto } from './dto/department.dto';

@Injectable()
export class DepartmentService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async getList(input: BaseSearchInput): Promise<BaseSearchResponse<DepartmentDto>> {
    const total = await this.prisma.department.count({
      where: {
        name: { contains: input.search_text },
      },
    })
    const data = await this.prisma.department.findMany({
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

  async create(input: CreateDepartmentInput): Promise<string> {
    await this.prisma.department.create({
      data: {
        ...input
      }
    })
    return 'Thành công'
  }

  async update(input: CreateDepartmentInput, id: string): Promise<string> {
    await this.prisma.department.update({
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
    await this.prisma.department.delete({
      where: {
        id
      }
    })
    return 'Thành công'
  }
}
