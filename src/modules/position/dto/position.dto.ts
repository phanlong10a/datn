import { ROLE } from "@prisma/client";

export interface PositionDto {

  id?: string;
  cost_salary: number;
  bonus_salary: number,
  name: string;
  is_insurance: boolean;
  total_insurance_percent: number;
  bhxh_insurance_percent: number;
  bhyt_insurance_percent: number;
  bhtn_insurance_percent: number;
  created_at: string;
  updated_at: string;
}
