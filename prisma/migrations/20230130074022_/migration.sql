-- AlterTable
ALTER TABLE "user" ALTER COLUMN "phone" SET DEFAULT '0';

-- CreateTable
CREATE TABLE "test_table" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "test_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "test_table_pkey" PRIMARY KEY ("id")
);
