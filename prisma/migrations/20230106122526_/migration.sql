-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_departmentId_fkey";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "departmentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;
