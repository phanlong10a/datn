/*
  Warnings:

  - A unique constraint covering the columns `[receipt_transactionId]` on the table `prescription_transation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "prescription_transation_receipt_transactionId_key" ON "prescription_transation"("receipt_transactionId");
