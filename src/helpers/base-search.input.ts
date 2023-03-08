import { IsNotEmpty } from 'class-validator';

export class BaseSearchInput {
  search_text: string;

  @IsNotEmpty()
  size: number;

  @IsNotEmpty()
  page: number;
}
