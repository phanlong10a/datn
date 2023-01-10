import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const salt = 10;

@Injectable()
export class HashingService {
  async hash(password: string) {
    return await bcrypt.hash(password, salt);
  }

  async match(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
