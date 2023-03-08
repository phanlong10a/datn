import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePatientDto {
  @IsNotEmpty()
  @IsString()
  email: string;
  cccd: string;
  phone: string;
  avatar: string;
  fullName: string;
  address: string;
  dateOfBirth: string;
}
