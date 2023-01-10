import { BaseSearchInput } from "src/helpers/base-search.input";

export class SearchCheckinInput extends BaseSearchInput {
  start_date: string;
  end_date: string;
  staffCode: string;
}