import { ROLE } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserInput {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  role: ROLE;

  @IsNotEmpty()
  @IsString()
  departmentId: string;


  @IsNotEmpty()
  @IsString()
  positionId: string;
}
