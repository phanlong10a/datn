import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/share_modules/prisma.service';
import * as moment from 'moment';
import { BaseSearchInput } from 'src/helpers/base-search.input';
import { BaseSearchResponse } from 'src/helpers/base-search.output';
import { DepartmentDto } from '../department/dto/department.dto';
import { PolicyDto } from './dto/policy.dto';
import { CreatePolicyDto } from './dto/create-policy.dto';

@Injectable()
export class PolicyService {
  constructor(private readonly prisma: PrismaService) {

  }

  async getList(input: BaseSearchInput): Promise<BaseSearchResponse<PolicyDto>> {
    const total = await this.prisma.policy.count({
      where: {
        title: { contains: input.search_text },
      },
    })
    const data = await this.prisma.policy.findMany({
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

  async create(input: CreatePolicyDto): Promise<string> {
    await this.prisma.policy.create({
      data: {
        ...input
      }
    })
    return 'Thành công'
  }

  async update(input: CreatePolicyDto, id: string): Promise<string> {
    await this.prisma.policy.update({
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
    await this.prisma.policy.delete({
      where: {
        id
      }
    })
    return 'Thành công'
  }
}
