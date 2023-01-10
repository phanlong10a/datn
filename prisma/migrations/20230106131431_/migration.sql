-- DropIndex
DROP INDEX "user_email_key";

-- DropIndex
DROP INDEX "user_phone_key";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;
