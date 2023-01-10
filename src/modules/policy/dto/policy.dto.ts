import { PartialType } from '@nestjs/mapped-types';

export interface PolicyDto {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}
