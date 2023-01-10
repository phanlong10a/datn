export interface CheckinDto {
  total_hours?: number;
  data: {
    checkin?: string;
    checkout?: string;
  }
}