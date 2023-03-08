import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserInput {
  @IsNotEmpty()
  @IsString()
  email: string;

  cccd: string;

  startDate: string;

  bankNumber: string;

  backAccount: string;

  statusWork: string;

  note: string;
}
