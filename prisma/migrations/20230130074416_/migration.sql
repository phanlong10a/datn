-- AlterTable
ALTER TABLE "test_table" ADD COLUMN     "roleId" TEXT;

-- AddForeignKey
ALTER TABLE "test_table" ADD CONSTRAINT "test_table_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE SET NULL ON UPDATE CASCADE;
