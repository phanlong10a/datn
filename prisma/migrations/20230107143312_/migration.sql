/*
  Warnings:

  - You are about to drop the column `checkout_date` on the `checkin_logs` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[staffCode]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "checkin_logs" DROP COLUMN "checkout_date",
ADD COLUMN     "checkout_time" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "user_staffCode_key" ON "user"("staffCode");
