/*
  Warnings:

  - You are about to drop the column `prescriptionId` on the `prescription_medicine` table. All the data in the column will be lost.
  - You are about to drop the `medicine_transaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `prescription` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TINH_THUOC" AS ENUM ('HAN', 'LUONG', 'NHIET', 'ON', 'BINH');

-- CreateEnum
CREATE TYPE "VI_CUA_THUOC" AS ENUM ('NGOT', 'CAY', 'DANG', 'CHUA', 'MAN');

-- CreateEnum
CREATE TYPE "NGUYEN_LIEU" AS ENUM ('THUC_VAT', 'DONG_VAT', 'KHAC');

-- CreateEnum
CREATE TYPE "SIDE_THUOC" AS ENUM ('THUOC_BAC', 'THUOC_NAM');

-- DropForeignKey
ALTER TABLE "medicine_transaction" DROP CONSTRAINT "medicine_transaction_medicineId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_transaction" DROP CONSTRAINT "medicine_transaction_receipt_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "prescription_medicine" DROP CONSTRAINT "prescription_medicine_prescriptionId_fkey";

-- DropForeignKey
ALTER TABLE "prescription_transation" DROP CONSTRAINT "prescription_transation_prescriptionId_fkey";

-- AlterTable
ALTER TABLE "medicine" ADD COLUMN     "image" TEXT,
ADD COLUMN     "nguyen_lieu" "NGUYEN_LIEU",
ADD COLUMN     "side_thuoc" "SIDE_THUOC",
ADD COLUMN     "tinh_thuoc" "TINH_THUOC",
ADD COLUMN     "vi_cua_thuoc" "VI_CUA_THUOC";

-- AlterTable
ALTER TABLE "prescription_medicine" DROP COLUMN "prescriptionId",
ADD COLUMN     "prescription_transationId" TEXT;

-- AlterTable
ALTER TABLE "prescription_transation" ADD COLUMN     "description" TEXT,
ADD COLUMN     "disease" TEXT,
ADD COLUMN     "total_count" INTEGER;

-- DropTable
DROP TABLE "medicine_transaction";

-- DropTable
DROP TABLE "prescription";

-- AddForeignKey
ALTER TABLE "prescription_medicine" ADD CONSTRAINT "prescription_medicine_prescription_transationId_fkey" FOREIGN KEY ("prescription_transationId") REFERENCES "prescription_transation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
