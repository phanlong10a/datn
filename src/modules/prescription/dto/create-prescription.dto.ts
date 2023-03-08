export class CreatePrescriptionDto {
  name?: string;
  disease?: string;
  medicine?: {
    id: string;
    amount_dosage: number;
  }[];
}
