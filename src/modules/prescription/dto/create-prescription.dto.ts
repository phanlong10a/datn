import { IsNotEmpty } from 'class-validator';
export class CreatePrescriptionDto {
  @IsNotEmpty()
  receiptId: string;
  disease?: string;
  name?: string;
  totalCount?: string;
  description?: string;
  isComplete?: boolean;
  medicine?: MedicinePrescription[];
}
export class MedicinePrescription {
  id: string;
  amount_dosage: number;
}
