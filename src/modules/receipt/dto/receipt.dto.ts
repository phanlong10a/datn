import { IsNotEmpty } from 'class-validator';
export class CreatePrescriptionDto {
  @IsNotEmpty()
  patientId: string;

  isComplete: boolean;

  measure_fee: number;

  prescription_transation: string[];
}
export class MedicinePrescription {
  id: string;
  amount_dosage: number;
}
