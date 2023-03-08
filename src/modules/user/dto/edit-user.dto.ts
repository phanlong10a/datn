import { IsNotEmpty, IsString } from 'class-validator';

export class EditUserInput {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  cccd: string;

  startDate: string;

  bankNumber: string;

  backAccount: string;

  statusWork: string;

  note: string;
}
