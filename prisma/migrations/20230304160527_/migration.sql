/*
  Warnings:

  - You are about to drop the column `patientId` on the `medicine_transaction` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `prescription_transation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "medicine_transaction" DROP CONSTRAINT "medicine_transaction_patientId_fkey";

-- DropForeignKey
ALTER TABLE "prescription_transation" DROP CONSTRAINT "prescription_transation_patientId_fkey";

-- AlterTable
ALTER TABLE "medicine_transaction" DROP COLUMN "patientId",
ADD COLUMN     "isComplete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "receipt_transactionId" TEXT;

-- AlterTable
ALTER TABLE "prescription_transation" DROP COLUMN "patientId",
ADD COLUMN     "isComplete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "receipt_transactionId" TEXT;

-- CreateTable
CREATE TABLE "receipt_transaction" (
    "id" TEXT NOT NULL,
    "measure_fee" DOUBLE PRECISION,
    "isComplete" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "patientId" TEXT,

    CONSTRAINT "receipt_transaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "medicine_transaction" ADD CONSTRAINT "medicine_transaction_receipt_transactionId_fkey" FOREIGN KEY ("receipt_transactionId") REFERENCES "receipt_transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescription_transation" ADD CONSTRAINT "prescription_transation_receipt_transactionId_fkey" FOREIGN KEY ("receipt_transactionId") REFERENCES "receipt_transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipt_transaction" ADD CONSTRAINT "receipt_transaction_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;
