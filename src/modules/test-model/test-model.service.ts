import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../share_modules/prisma.service';

@Injectable()
export class TestModelService {

  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(input: any) {
   const a = await this.prisma.test_table.create({
      data:{
        name: input.name
      }
    })
    return a
  }
}
