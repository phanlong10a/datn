/*
  Warnings:

  - You are about to drop the column `departmentId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `positionId` on the `user` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MEASURE_UNIT" AS ENUM ('MG', 'ML');

-- CreateEnum
CREATE TYPE "MEDICINE_TYPE" AS ENUM ('THANG', 'HOAN', 'TAN', 'CAO', 'DAN');

-- AlterTable
ALTER TABLE "user" DROP COLUMN "departmentId",
DROP COLUMN "positionId";

-- CreateTable
CREATE TABLE "medicine" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "measure_unit" "MEASURE_UNIT",
    "description" TEXT,
    "type" "MEDICINE_TYPE",
    "dosage" TEXT,
    "price_per_unit" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medicine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescription_medicine" (
    "id" TEXT NOT NULL,
    "medicineId" TEXT,
    "amount_dosage" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "prescriptionId" TEXT,

    CONSTRAINT "prescription_medicine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicine_transaction" (
    "id" TEXT NOT NULL,
    "medicineId" TEXT,
    "amount_price" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "patientId" TEXT,

    CONSTRAINT "medicine_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescription" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "disease" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescription_transation" (
    "id" TEXT NOT NULL,
    "total_amount" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "prescriptionId" TEXT,
    "patientId" TEXT,

    CONSTRAINT "prescription_transation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT DEFAULT '0',
    "avatar" TEXT,
    "fullName" TEXT,
    "address" TEXT,
    "dateOfBirth" TEXT,
    "cccd" TEXT,
    "bankNumber" TEXT,
    "backAccount" TEXT,
    "note" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "patient_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "prescription_medicine" ADD CONSTRAINT "prescription_medicine_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescription_medicine" ADD CONSTRAINT "prescription_medicine_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "prescription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicine_transaction" ADD CONSTRAINT "medicine_transaction_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicine_transaction" ADD CONSTRAINT "medicine_transaction_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescription_transation" ADD CONSTRAINT "prescription_transation_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "prescription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescription_transation" ADD CONSTRAINT "prescription_transation_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;
