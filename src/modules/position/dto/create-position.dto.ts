import { ROLE } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePositionInput {
  @IsNotEmpty()
  cost_salary: number;

  @IsNotEmpty()
  bonus_salary: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  is_insurance: boolean;
}
