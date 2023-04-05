import { IsNotEmpty } from 'class-validator';
export class CreatePrescriptionDto {
  @IsNotEmpty()
  patientId: string;

  isComplete: boolean;

  measure_fee: number;

  prescription_transation: string[];
}

export class CreatePrescriptionDto1 {
  @IsNotEmpty()
  patientId: string;

  diagnose: string;

  measure_fee: number;

  description: string;

  total_count: number;

  medicine: {
    medicine: string;
    amount_dosage: number;
  }[];
}
export class MedicinePrescription {
  id: string;
  amount_dosage: number;
}
