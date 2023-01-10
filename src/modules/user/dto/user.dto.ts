import { ROLE } from "@prisma/client";

export interface UserDto {

  id?: string;

  fullName?: string;

  email?: string;

  staffCode?: string;

  phone?: string;

  dateOfBirth?: string;

  address?: string;

  createdAt?: string;

  department?: any;

  position?: any;

  departmentId?: string;

  positionId?: string;

  created_at?: string;

  updated_at?: string;

  status?: boolean;

  role?: ROLE;

  checkin_logs?: any
}
