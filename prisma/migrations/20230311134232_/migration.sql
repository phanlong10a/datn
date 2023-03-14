-- AlterTable
ALTER TABLE "prescription_transation" ALTER COLUMN "isComplete" DROP NOT NULL;

-- AlterTable
ALTER TABLE "receipt_transaction" ALTER COLUMN "isComplete" DROP NOT NULL,
ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "code" DROP NOT NULL,
ALTER COLUMN "paidStatus" DROP NOT NULL;
