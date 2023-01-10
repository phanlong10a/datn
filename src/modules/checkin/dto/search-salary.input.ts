import { BaseSearchInput } from "src/helpers/base-search.input";

export class SearchSalaryInput extends BaseSearchInput {
  start_date: string;
  end_date: string;
  staffCode: string;
  total_day_worked: number;
}