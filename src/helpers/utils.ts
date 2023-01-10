import { BadRequestException } from '@nestjs/common';
import * as path from 'path';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as dayjs from 'dayjs';
import * as xlsx from 'xlsx';

export const convertFileName = (req, file, callback) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const ext = path.extname(file.originalname);
  if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
    const filename = `${uniqueSuffix}${ext}`;
    return callback(null, filename);
  }
  callback(new BadRequestException('file is type image'));
};
interface NotificationContent {
  title: string;
  body: string;
}

export const filterDate = (
  date_created_from: string,
  date_created_to: string,
) => {
  const filter: any = {};
  if (!!date_created_from) {
    filter.gte = dayjs(date_created_from).isValid()
      ? dayjs(date_created_from).set('hours', 0).set('minute', 1).toDate()
      : dayjs('0001/01/01').toDate();
  } else {
    filter.gte = dayjs('0001/01/01').toDate()
  }
  if (!!date_created_to) {
    filter.lte = dayjs(date_created_to).isValid()
      ? dayjs(date_created_to).add(1, 'day').set('hours', 0).set('minute', 1).toDate()
      : dayjs('3099/01/01').toDate();
  } else {
    filter.lte = dayjs('3099/01/01').toDate()
  }
  return filter;
};

export const hash = async (password: string) => {
  return await bcrypt.hash(password, 10);
};
export const generateOTP = () => {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};
export const generateInviteCode = (userId: number) => {
  const stringValue = '' + userId;
  const pad = '0000000';
  return pad.substring(0, pad.length - stringValue.length) + stringValue;
};

export function getNewestFile(files, path) {
  var out = [];
  files.forEach(function (file) {
    var stats = fs.statSync(path + "/" + file);
    if (stats.isFile()) {
      out.push({ "file": file, "mtime": stats.mtime.getTime() });
    }
  });
  out.sort(function (a, b) {
    return b.mtime - a.mtime;
  })
  return (out.length > 0) ? out[0].file : "";
}

export function numberWithDots(x: number) {
  if (!x) return 0;
  const arrStr = x.toString().split('.');
  let res = arrStr[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return arrStr.length === 1 ? res : `${res},${arrStr[1].slice(0, 2)}`;
}


export const exportExcel = (data, column, name, filePath) => {
  const workbook = xlsx.utils.book_new();
  const workSheetData = [
    column,
    ...data
  ]
  const workSheet = xlsx.utils.aoa_to_sheet(workSheetData)
  xlsx.utils.book_append_sheet(workbook, workSheet, name);
  xlsx.writeFile(workbook, filePath + '/' + name);
}