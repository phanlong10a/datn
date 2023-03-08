import { MEASURE_UNIT, MEDICINE_TYPE } from '@prisma/client';

export class medicineDto {
  id?: string;
  name?: string;
  measure_unit?: MEASURE_UNIT; // đơn vị đo
  description?: string;
  type?: MEDICINE_TYPE; // loại thuốc
  dosage?: string; // liều dùng cơ bản
  price_per_unit?: number; // giá trên mỗi đơn vị
  created_at?: string;
  updated_at?: string;
  images?: string;
}
