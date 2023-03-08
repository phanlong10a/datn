/*
  Warnings:

  - You are about to drop the column `dependent_person` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `checkin_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `department` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `news` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `policy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `position` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `test_table` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "checkin_logs" DROP CONSTRAINT "checkin_logs_userId_fkey";

-- DropForeignKey
ALTER TABLE "test_table" DROP CONSTRAINT "test_table_roleId_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_positionId_fkey";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "dependent_person",
DROP COLUMN "role";

-- DropTable
DROP TABLE "checkin_logs";

-- DropTable
DROP TABLE "department";

-- DropTable
DROP TABLE "news";

-- DropTable
DROP TABLE "policy";

-- DropTable
DROP TABLE "position";

-- DropTable
DROP TABLE "role";

-- DropTable
DROP TABLE "test_table";
