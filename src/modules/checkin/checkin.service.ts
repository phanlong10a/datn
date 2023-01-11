import { BadRequestException, Injectable } from '@nestjs/common';
import { user } from '@prisma/client';
import * as moment from 'moment';
import { BaseSearchResponse } from 'src/helpers/base-search.output';
import { exportExcel, filterDate } from 'src/helpers/utils';
import { PrismaService } from 'src/share_modules/prisma.service';
import { UserDto } from '../user/dto/user.dto';
import * as path from 'path';
import { CheckinDto } from './dto/checkin.dto';
import { SearchCheckinInput } from './dto/search-checkin.dto';
import { SearchSalaryInput } from './dto/search-salary.input';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { randomUUID } from 'crypto';


@Injectable()
export class CheckinService {
  constructor(private readonly prisma: PrismaService) {

  }

  async getCheckin(id: string): Promise<CheckinDto> {
    const lastCheckin = await this.prisma.checkin_logs.findFirst({
      where: {
        userId: id,
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    const totalHour = await this.prisma.checkin_logs.aggregate({
      where: {
        userId: id,
        created_at: {
          gte: moment().set('hour', 0).format(),
          lte: moment().set('hour', 0).add(1, 'day').format(),
        }
      },
      _sum: {
        total_hours: true
      }
    })

    if (!!lastCheckin?.checkin_time && !!lastCheckin?.checkout_time) {
      return {
        total_hours: parseFloat(totalHour._sum.total_hours.toFixed(2)),
        data: {
          checkin: null,
          checkout: null,
        }
      }
    }
    return {
      total_hours: totalHour._sum.total_hours ? parseFloat(totalHour._sum.total_hours?.toFixed(2)) : 0,
      data: {
        checkin: lastCheckin?.checkin_time ? moment(lastCheckin.checkin_time).format() : null,
        checkout: lastCheckin?.checkout_time ? moment(lastCheckin.checkout_time).format() : null,
      }
    }
  }


  async checkin(id: string): Promise<string> {
    const lastCheckin = await this.prisma.checkin_logs.findFirst({
      where: {
        userId: id,
      },
      orderBy: {
        created_at: 'desc'
      }
    })
    if (!!lastCheckin?.checkin_time && !lastCheckin?.checkout_time) {
      throw new BadRequestException('Bạn chưa checkout')
    }

    await this.prisma.checkin_logs.create({
      data: {
        userId: id,
        checkin_time: moment().format(),
        checkout_time: null,
      }
    })
    return 'Checkin thành công'
  }



  async checkout(id: string): Promise<string> {
    const lastCheckin = await this.prisma.checkin_logs.findFirst({
      where: {
        userId: id,
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    if (lastCheckin?.checkin_time === lastCheckin?.checkout_time) {
      throw new BadRequestException('Bạn chưa checkin')
    }

    if (!lastCheckin?.checkin_time) {
      throw new BadRequestException('Bạn chưa checkin')
    }



    const hourWork = moment().diff(moment(lastCheckin.checkin_time), 'hours', true)


    await this.prisma.checkin_logs.update({
      where: {
        id: lastCheckin.id
      },
      data: {
        checkout_time: moment().format(),
        total_hours: parseFloat(hourWork.toFixed(2))
      }
    })

    return 'Checkout thành công'
  }


  async getListCheckin(input: SearchCheckinInput): Promise<BaseSearchResponse<any>> {
    const filter = filterDate(input.start_date, input.end_date)
    const total = await this.prisma.checkin_logs.count()
    const checkins = await this.prisma.checkin_logs.findMany({
      where: {
        user: {
          staffCode: { contains: input?.staffCode || '', mode: 'insensitive' },
        },
        created_at: {
          ...filter
        }
      },
      include: {
        user: {
          select: {
            fullName: true,
            staffCode: true
          }
        }
      }
    })
    return {
      total,
      data: checkins.map((data) => {
        return {
          ...data,
          data: {
            checkin: data?.checkin_time ? moment(data.checkin_time).format() : null,
            checkout: data?.checkout_time ? moment(data.checkout_time).format() : null,
          }
        }
      })
    }
  }

  async getListSalary(input: SearchSalaryInput): Promise<BaseSearchResponse<any>> {
    const workTotal = input.total_day_worked * 8
    const filter = filterDate(input.start_date, input.end_date)

    const totalWork = await this.prisma.checkin_logs.groupBy({
      by: ['userId'],
      _sum: {
        total_hours: true,
      },
      where: {
        created_at: {
          ...filter
        },
        user: {
          staffCode: { contains: input?.staffCode || '', mode: 'insensitive' },
        }
      },
    })

    const newList: ({
      totalWork: number,
      cost_salary: number,
      bonus_salary: number,
      is_insurance: boolean,
      total_insurance_percent: number,
      bhxh_insurance_percent: number,
      bhyt_insurance_percent: number,
      bhtn_insurance_percent: number,
      dependent_person: number,
      email?: string,
      fullName?: string,
      staffCode?: string,
      tax?: number,
      total_insurance?: number,
      bhxh_insurance?: number,
      bhyt_insurance?: number,
      bhtn_insurance?: number,
      expected_salary?: number,
    })[] = []

    for (let i = 0; i < totalWork.length; i++) {
      const searchUser = await this.prisma.user.findFirst({
        where: {
          id: totalWork[i].userId
        },
        include: {
          position: true
        },
      })
      newList.push({
        totalWork: totalWork[i]._sum.total_hours,
        email: searchUser.email,
        fullName: searchUser.fullName,
        staffCode: searchUser.staffCode,
        cost_salary: searchUser.position.cost_salary,
        bonus_salary: searchUser.position.bonus_salary,
        total_insurance_percent: searchUser.position.total_insurance_percent,
        bhxh_insurance_percent: searchUser.position.bhxh_insurance_percent,
        bhyt_insurance_percent: searchUser.position.bhyt_insurance_percent,
        bhtn_insurance_percent: searchUser.position.bhtn_insurance_percent,
        is_insurance: searchUser.position.is_insurance,
        dependent_person: searchUser.dependent_person,
      })
    }

    for (let i = 0; i < newList.length; i++) {
      const total_insurance = newList[i].is_insurance ? (newList[i].cost_salary * newList[i].total_insurance_percent) / 100 : null
      const bhxh_insurance = newList[i].is_insurance ? (newList[i].cost_salary * newList[i].bhxh_insurance_percent) / 100 : null
      const bhyt_insurance = newList[i].is_insurance ? (newList[i].cost_salary * newList[i].bhyt_insurance_percent) / 100 : null
      const bhtn_insurance = newList[i].is_insurance ? (newList[i].cost_salary * newList[i].bhtn_insurance_percent) / 100 : null
      const money_1_hour = (newList[i].cost_salary + newList[i].bonus_salary - total_insurance) / workTotal
      let expected_salary = 0;
      if (newList[i].totalWork > workTotal) {
        let overtime = (newList[i].totalWork - workTotal) * 1.5 * money_1_hour;
        let costtime = workTotal * money_1_hour
        expected_salary = newList[i].is_insurance ? overtime + costtime - total_insurance : overtime + costtime
      } else {
        expected_salary = newList[i].is_insurance ? newList[i].totalWork * money_1_hour - total_insurance : newList[i].totalWork * money_1_hour
      }
      console.log("🚀 ~ file: checkin.service.ts:235 ~ CheckinService ~ getListSalary ~ expected_salary", expected_salary)

      const tax_deduction = 11000000 + newList[i].dependent_person * 4000000
      console.log("🚀 ~ file: checkin.service.ts:239 ~ CheckinService ~ getListSalary ~ tax_deduction", tax_deduction)
      let totalTax = 0

      if (expected_salary > tax_deduction) {
        const salary_in_tax = expected_salary - tax_deduction
        console.log("🚀 ~ file: checkin.service.ts:244 ~ CheckinService ~ getListSalary ~ salary_in_tax", salary_in_tax)
        switch (true) {
          case (0 < salary_in_tax && salary_in_tax <= 5000000):
            totalTax = (salary_in_tax * 5) / 100
            break;
          case (5000000 < salary_in_tax && salary_in_tax <= 10000000):
            totalTax = (salary_in_tax * 10) / 100 - 250000
            console.log("🚀 ~ file: checkin.service.ts:254 ~ CheckinService ~ getListSalary ~ totalTax", totalTax)
            break;
          case (10000000 < salary_in_tax && salary_in_tax <= 18000000):
            totalTax = (salary_in_tax * 15) / 100 - 750000
            console.log("🚀 ~ file: checkin.service.ts:254 ~ CheckinService ~ getListSalary ~ totalTax", totalTax)
            break;
          case (18000000 < salary_in_tax && salary_in_tax <= 32000000):
            totalTax = (salary_in_tax * 20) / 100 - 1650000
            break;
          case (32000000 < salary_in_tax && salary_in_tax <= 52000000):
            totalTax = (salary_in_tax * 25) / 100 - 3250000
            break;
          case (52000000 < salary_in_tax && salary_in_tax <= 80000000):
            totalTax = (salary_in_tax * 30) / 100 - 5850000
            break;
          case (80000000 < salary_in_tax):
            totalTax = (salary_in_tax * 35) / 100 - 9850000
            break;
        }
      }

      newList[i] = {
        ...newList[i],
        total_insurance,
        bhxh_insurance,
        bhyt_insurance,
        bhtn_insurance,
        expected_salary: expected_salary - totalTax,
        tax: totalTax
      }
    }


    const total = newList.length;
    const data = newList.slice(((input.page) - 1) * input.size, ((input.page) - 1) * input.size + input.size)


    return {
      total: total,
      data: data
    }
  }
  async getSalary(input: SearchSalaryInput): Promise<BaseSearchResponse<any>> {
    const workTotal = input.total_day_worked * 8
    const filter = filterDate(input.start_date, input.end_date)

    const totalWork = await this.prisma.checkin_logs.groupBy({
      by: ['userId'],
      _sum: {
        total_hours: true,
      },
      where: {
        created_at: {
          ...filter
        },
        user: {
          staffCode: { equals: input?.staffCode || '', mode: 'insensitive' },
        }
      },
    })

    const newList: ({
      totalWork: number,
      cost_salary: number,
      bonus_salary: number,
      is_insurance: boolean,
      total_insurance_percent: number,
      bhxh_insurance_percent: number,
      bhyt_insurance_percent: number,
      bhtn_insurance_percent: number,
      dependent_person: number,
      email?: string,
      fullName?: string,
      staffCode?: string,
      tax?: number,
      total_insurance?: number,
      bhxh_insurance?: number,
      bhyt_insurance?: number,
      bhtn_insurance?: number,
      expected_salary?: number,
    })[] = []

    for (let i = 0; i < totalWork.length; i++) {
      const searchUser = await this.prisma.user.findFirst({
        where: {
          id: totalWork[i].userId
        },
        include: {
          position: true
        },
      })
      newList.push({
        totalWork: totalWork[i]._sum.total_hours,
        email: searchUser.email,
        fullName: searchUser.fullName,
        staffCode: searchUser.staffCode,
        cost_salary: searchUser.position.cost_salary,
        bonus_salary: searchUser.position.bonus_salary,
        total_insurance_percent: searchUser.position.total_insurance_percent,
        bhxh_insurance_percent: searchUser.position.bhxh_insurance_percent,
        bhyt_insurance_percent: searchUser.position.bhyt_insurance_percent,
        bhtn_insurance_percent: searchUser.position.bhtn_insurance_percent,
        is_insurance: searchUser.position.is_insurance,
        dependent_person: searchUser.dependent_person,
      })
    }

    for (let i = 0; i < newList.length; i++) {
      const total_insurance = newList[i].is_insurance ? (newList[i].cost_salary * newList[i].total_insurance_percent) / 100 : null
      const bhxh_insurance = newList[i].is_insurance ? (newList[i].cost_salary * newList[i].bhxh_insurance_percent) / 100 : null
      const bhyt_insurance = newList[i].is_insurance ? (newList[i].cost_salary * newList[i].bhyt_insurance_percent) / 100 : null
      const bhtn_insurance = newList[i].is_insurance ? (newList[i].cost_salary * newList[i].bhtn_insurance_percent) / 100 : null
      const money_1_hour = (newList[i].cost_salary + newList[i].bonus_salary - total_insurance) / workTotal
      let expected_salary = 0;
      if (newList[i].totalWork > workTotal) {
        let overtime = (newList[i].totalWork - workTotal) * 1.5 * money_1_hour;
        let costtime = workTotal * money_1_hour
        expected_salary = newList[i].is_insurance ? overtime + costtime - total_insurance : overtime + costtime
      } else {
        expected_salary = newList[i].is_insurance ? newList[i].totalWork * money_1_hour - total_insurance : newList[i].totalWork * money_1_hour
      }
      console.log("🚀 ~ file: checkin.service.ts:235 ~ CheckinService ~ getListSalary ~ expected_salary", expected_salary)

      const tax_deduction = 11000000 + newList[i].dependent_person * 4000000
      console.log("🚀 ~ file: checkin.service.ts:239 ~ CheckinService ~ getListSalary ~ tax_deduction", tax_deduction)
      let totalTax = 0

      if (expected_salary > tax_deduction) {
        const salary_in_tax = expected_salary - tax_deduction
        console.log("🚀 ~ file: checkin.service.ts:244 ~ CheckinService ~ getListSalary ~ salary_in_tax", salary_in_tax)
        switch (true) {
          case (0 < salary_in_tax && salary_in_tax <= 5000000):
            totalTax = (salary_in_tax * 5) / 100
            break;
          case (5000000 < salary_in_tax && salary_in_tax <= 10000000):
            totalTax = (salary_in_tax * 10) / 100 - 250000
            console.log("🚀 ~ file: checkin.service.ts:254 ~ CheckinService ~ getListSalary ~ totalTax", totalTax)
            break;
          case (10000000 < salary_in_tax && salary_in_tax <= 18000000):
            totalTax = (salary_in_tax * 15) / 100 - 750000
            console.log("🚀 ~ file: checkin.service.ts:254 ~ CheckinService ~ getListSalary ~ totalTax", totalTax)
            break;
          case (18000000 < salary_in_tax && salary_in_tax <= 32000000):
            totalTax = (salary_in_tax * 20) / 100 - 1650000
            break;
          case (32000000 < salary_in_tax && salary_in_tax <= 52000000):
            totalTax = (salary_in_tax * 25) / 100 - 3250000
            break;
          case (52000000 < salary_in_tax && salary_in_tax <= 80000000):
            totalTax = (salary_in_tax * 30) / 100 - 5850000
            break;
          case (80000000 < salary_in_tax):
            totalTax = (salary_in_tax * 35) / 100 - 9850000
            break;
        }
      }

      newList[i] = {
        ...newList[i],
        total_insurance,
        bhxh_insurance,
        bhyt_insurance,
        bhtn_insurance,
        expected_salary: expected_salary - totalTax,
        tax: totalTax
      }
    }


    const total = newList.length;
    const data = newList.slice(((input.page) - 1) * input.size, ((input.page) - 1) * input.size + input.size)


    return {
      total: total,
      data: data
    }
  }

  async toExcel(input: SearchSalaryInput): Promise<any> {
    console.log("🚀 ~ file: checkin.service.ts:300 ~ CheckinService ~ toExcel ~ input", input)
    const workTotal = input.total_day_worked * 8
    const filter = filterDate(input.start_date, input.end_date)

    const totalWork = await this.prisma.checkin_logs.groupBy({
      by: ['userId'],
      _sum: {
        total_hours: true,
      },
      where: {
        created_at: {
          ...filter
        },
        user: {
          staffCode: { contains: input?.staffCode || '', mode: 'insensitive' },
        }
      },
    })

    const newList: ({
      totalWork: number,
      cost_salary: number,
      bonus_salary: number,
      is_insurance: boolean,
      total_insurance_percent: number,
      bhxh_insurance_percent: number,
      bhyt_insurance_percent: number,
      bhtn_insurance_percent: number,
      dependent_person: number,
      email?: string,
      fullName?: string,
      staffCode?: string,
      tax?: number,
      total_insurance?: number,
      bhxh_insurance?: number,
      bhyt_insurance?: number,
      bhtn_insurance?: number,
      expected_salary?: number,
    })[] = []

    for (let i = 0; i < totalWork.length; i++) {
      const searchUser = await this.prisma.user.findFirst({
        where: {
          id: totalWork[i].userId
        },
        include: {
          position: true
        },
      })
      newList.push({
        totalWork: totalWork[i]._sum.total_hours,
        email: searchUser.email,
        fullName: searchUser.fullName,
        staffCode: searchUser.staffCode,
        cost_salary: searchUser.position.cost_salary,
        bonus_salary: searchUser.position.bonus_salary,
        total_insurance_percent: searchUser.position.total_insurance_percent,
        bhxh_insurance_percent: searchUser.position.bhxh_insurance_percent,
        bhyt_insurance_percent: searchUser.position.bhyt_insurance_percent,
        bhtn_insurance_percent: searchUser.position.bhtn_insurance_percent,
        is_insurance: searchUser.position.is_insurance,
        dependent_person: searchUser.dependent_person,
      })
    }

    for (let i = 0; i < newList.length; i++) {
      const total_insurance = newList[i].is_insurance ? (newList[i].cost_salary * newList[i].total_insurance_percent) / 100 : null
      const bhxh_insurance = newList[i].is_insurance ? (newList[i].cost_salary * newList[i].bhxh_insurance_percent) / 100 : null
      const bhyt_insurance = newList[i].is_insurance ? (newList[i].cost_salary * newList[i].bhyt_insurance_percent) / 100 : null
      const bhtn_insurance = newList[i].is_insurance ? (newList[i].cost_salary * newList[i].bhtn_insurance_percent) / 100 : null
      const money_1_hour = (newList[i].cost_salary + newList[i].bonus_salary - total_insurance) / workTotal
      let expected_salary = 0;
      if (newList[i].totalWork > workTotal) {
        let overtime = (newList[i].totalWork - workTotal) * 1.5 * money_1_hour;
        let costtime = workTotal * money_1_hour
        expected_salary = newList[i].is_insurance ? overtime + costtime - total_insurance : overtime + costtime
      } else {
        expected_salary = newList[i].is_insurance ? newList[i].totalWork * money_1_hour - total_insurance : newList[i].totalWork * money_1_hour
      }

      const tax_deduction = 11000000 + newList[i].dependent_person * 4000000
      let totalTax = 0

      if (expected_salary > tax_deduction) {
        const salary_in_tax = expected_salary - tax_deduction
        switch (true) {
          case (0 < salary_in_tax && salary_in_tax <= 5000000):
            totalTax = (salary_in_tax * 5) / 100
            break;
          case (5000000 < salary_in_tax && salary_in_tax <= 10000000):
            totalTax = (salary_in_tax * 10) / 100 - 250000
            break;
          case (10000000 < salary_in_tax && salary_in_tax <= 18000000):
            totalTax = (salary_in_tax * 15) / 100 - 750000
            break;
          case (18000000 < salary_in_tax && salary_in_tax <= 32000000):
            totalTax = (salary_in_tax * 20) / 100 - 1650000
            break;
          case (32000000 < salary_in_tax && salary_in_tax <= 52000000):
            totalTax = (salary_in_tax * 25) / 100 - 3250000
            break;
          case (52000000 < salary_in_tax && salary_in_tax <= 80000000):
            totalTax = (salary_in_tax * 30) / 100 - 5850000
            break;
          case (80000000 < salary_in_tax):
            totalTax = (salary_in_tax * 35) / 100 - 9850000
            break;
        }
      }

      newList[i] = {
        ...newList[i],
        total_insurance,
        bhxh_insurance,
        bhyt_insurance,
        bhtn_insurance,
        expected_salary: expected_salary - totalTax,
        tax: totalTax
      }
    }


    const data = newList

    const filePath = path.join(__dirname, '../../../', 'output_excel')

    const fileName = randomUUID()
    console.log("🚀 ~ file: checkin.service.ts:426 ~ CheckinService ~ toExcel ~ fileName", fileName)
    const dataMap = data.map((item) => {
      return [
        item.email,
        item.fullName,
        item.staffCode,
        item.tax,
        item.totalWork,
        item.cost_salary,
        item.bonus_salary,
        item.is_insurance ? 'Chính thức' : 'Thử việc',
        item.total_insurance,
        item.bhxh_insurance,
        item.bhyt_insurance,
        item.bhtn_insurance,
        item.expected_salary,
      ]
    })
    const columnName = [
      'Email',
      'Họ tên',
      'Mã nhân viên',
      'Thuế ước tính',
      'Số giờ làm việc',
      'Lương cơ bản',
      'Lương hoàn thành công việc',
      'Nhân viên',
      'Tổng bảo hiểm phải đóng',
      'Bảo hiểm xã hội',
      'Bảo hiểm y tế',
      'Bảo hiểm thất nghiệp',
      'Lương dự kiến',
    ]


    exportExcel(dataMap, columnName, 'file.xlsx', filePath)

    return 'thành công'
  }



  async toBillExcel(input: SearchSalaryInput): Promise<any> {
    console.log("🚀 ~ file: checkin.service.ts:300 ~ CheckinService ~ toExcel ~ input", input)
    const workTotal = input.total_day_worked * 8
    const filter = filterDate(input.start_date, input.end_date)

    const totalWork = await this.prisma.checkin_logs.groupBy({
      by: ['userId'],
      _sum: {
        total_hours: true,
      },
      where: {
        created_at: {
          ...filter
        },
        user: {
          staffCode: { equals: input?.staffCode || '', mode: 'insensitive' },
        }
      },
    })
    console.log("🚀 ~ file: checkin.service.ts:624 ~ CheckinService ~ toBillExcel ~ totalWork", totalWork)

    const newList: ({
      totalWork: number,
      cost_salary: number,
      bonus_salary: number,
      is_insurance: boolean,
      total_insurance_percent: number,
      bhxh_insurance_percent: number,
      bhyt_insurance_percent: number,
      bhtn_insurance_percent: number,
      dependent_person: number,
      email?: string,
      fullName?: string,
      staffCode?: string,
      tax?: number,
      total_insurance?: number,
      bhxh_insurance?: number,
      bhyt_insurance?: number,
      bhtn_insurance?: number,
      expected_salary?: number,
    })[] = []

    for (let i = 0; i < totalWork.length; i++) {
      const searchUser = await this.prisma.user.findFirst({
        where: {
          id: totalWork[i].userId
        },
        include: {
          position: true
        },
      })
      newList.push({
        totalWork: totalWork[i]._sum.total_hours,
        email: searchUser.email,
        fullName: searchUser.fullName,
        staffCode: searchUser.staffCode,
        cost_salary: searchUser.position.cost_salary,
        bonus_salary: searchUser.position.bonus_salary,
        total_insurance_percent: searchUser.position.total_insurance_percent,
        bhxh_insurance_percent: searchUser.position.bhxh_insurance_percent,
        bhyt_insurance_percent: searchUser.position.bhyt_insurance_percent,
        bhtn_insurance_percent: searchUser.position.bhtn_insurance_percent,
        is_insurance: searchUser.position.is_insurance,
        dependent_person: searchUser.dependent_person,
      })
    }

    for (let i = 0; i < newList.length; i++) {
      const total_insurance = newList[i].is_insurance ? (newList[i].cost_salary * newList[i].total_insurance_percent) / 100 : null
      const bhxh_insurance = newList[i].is_insurance ? (newList[i].cost_salary * newList[i].bhxh_insurance_percent) / 100 : null
      const bhyt_insurance = newList[i].is_insurance ? (newList[i].cost_salary * newList[i].bhyt_insurance_percent) / 100 : null
      const bhtn_insurance = newList[i].is_insurance ? (newList[i].cost_salary * newList[i].bhtn_insurance_percent) / 100 : null
      const money_1_hour = (newList[i].cost_salary + newList[i].bonus_salary - total_insurance) / workTotal
      let expected_salary = 0;
      if (newList[i].totalWork > workTotal) {
        let overtime = (newList[i].totalWork - workTotal) * 1.5 * money_1_hour;
        let costtime = workTotal * money_1_hour
        expected_salary = newList[i].is_insurance ? overtime + costtime - total_insurance : overtime + costtime
      } else {
        expected_salary = newList[i].is_insurance ? newList[i].totalWork * money_1_hour - total_insurance : newList[i].totalWork * money_1_hour
      }

      const tax_deduction = 11000000 + newList[i].dependent_person * 4000000
      let totalTax = 0

      if (expected_salary > tax_deduction) {
        const salary_in_tax = expected_salary - tax_deduction
        switch (true) {
          case (0 < salary_in_tax && salary_in_tax <= 5000000):
            totalTax = (salary_in_tax * 5) / 100
            break;
          case (5000000 < salary_in_tax && salary_in_tax <= 10000000):
            totalTax = (salary_in_tax * 10) / 100 - 250000
            break;
          case (10000000 < salary_in_tax && salary_in_tax <= 18000000):
            totalTax = (salary_in_tax * 15) / 100 - 750000
            break;
          case (18000000 < salary_in_tax && salary_in_tax <= 32000000):
            totalTax = (salary_in_tax * 20) / 100 - 1650000
            break;
          case (32000000 < salary_in_tax && salary_in_tax <= 52000000):
            totalTax = (salary_in_tax * 25) / 100 - 3250000
            break;
          case (52000000 < salary_in_tax && salary_in_tax <= 80000000):
            totalTax = (salary_in_tax * 30) / 100 - 5850000
            break;
          case (80000000 < salary_in_tax):
            totalTax = (salary_in_tax * 35) / 100 - 9850000
            break;
        }
      }

      newList[i] = {
        ...newList[i],
        total_insurance,
        bhxh_insurance,
        bhyt_insurance,
        bhtn_insurance,
        expected_salary: expected_salary - totalTax,
        tax: totalTax
      }
    }


    const data = newList

    const filePath = path.join(__dirname, '../../../', 'output_excel')

    const fileName = randomUUID()

    const mapData = data[0]

    const columnField = [
      "Thông tin",
      "Thông số"
    ]
    const value = [
      ['Email', mapData.email],
      ['Họ tên', mapData.fullName],
      ['Mã nhân viên', mapData.staffCode],
      ['Thuế ước tính', mapData.tax],
      ['Số giờ làm việc', mapData.totalWork],
      ['Lương cơ bản', mapData.cost_salary],
      ['Lương hoàn thành công việc', mapData.bonus_salary],
      ['Nhân viên', mapData.is_insurance ? 'Chính thức' : 'Thử việc'],
      ['Tổng bảo hiểm phải đóng', mapData.total_insurance],
      ['Bảo hiểm xã hội', mapData.bhxh_insurance],
      ['Bảo hiểm y tế', mapData.bhyt_insurance],
      ['Bảo hiểm thất nghiệp', mapData.bhtn_insurance],
      ['Lương dự kiến', mapData.expected_salary],
    ]


    exportExcel(value, columnField, 'phieu_luong_du_kien.xlsx', filePath)

    return 'thành công'
  }

}
