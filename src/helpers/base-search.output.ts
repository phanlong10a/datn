export interface BaseSearchResponse<T> {
  total: number;
  data: T[];
}
