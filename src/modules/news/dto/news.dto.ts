import { PartialType } from '@nestjs/mapped-types';

export interface NewsDto {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}
