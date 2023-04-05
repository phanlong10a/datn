-- AlterTable
ALTER TABLE "receipt_transaction" ADD COLUMN     "created_by_id" TEXT,
ADD COLUMN     "updated_by_id" TEXT;

-- AddForeignKey
ALTER TABLE "receipt_transaction" ADD CONSTRAINT "receipt_transaction_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipt_transaction" ADD CONSTRAINT "receipt_transaction_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
