import { ROLE } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class EditUserInput {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;
}
