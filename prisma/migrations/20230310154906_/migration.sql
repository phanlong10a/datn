/*
  Warnings:

  - Added the required column `code` to the `receipt_transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "receipt_transaction" ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "paidStatus" BOOLEAN NOT NULL DEFAULT false;
