import {
  MEASURE_UNIT,
  MEDICINE_TYPE,
  NGUYEN_LIEU,
  SIDE_THUOC,
  TINH_THUOC,
  VI_CUA_THUOC,
} from '@prisma/client';

export class medicineDto {
  id?: string;
  name?: string;
  measure_unit?: MEASURE_UNIT; // đơn vị đo
  description?: string;
  type?: MEDICINE_TYPE; // loại thuốc
  tinh_thuoc: TINH_THUOC;
  vi_cua_thuoc: VI_CUA_THUOC;
  nguyen_lieu: NGUYEN_LIEU;
  side_thuoc: SIDE_THUOC;
  dosage?: string; // liều dùng cơ bản
  price_per_unit?: number; // giá trên mỗi đơn vị
  created_at?: string;
  updated_at?: string;
  image?: string;
}
