-- CreateTable
CREATE TABLE "refresh_password" (
    "id" TEXT NOT NULL,
    "otp" INTEGER,
    "user_token" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "refresh_password_pkey" PRIMARY KEY ("id")
);
