import { PartialType } from '@nestjs/mapped-types';

export interface DepartmentDto {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}
