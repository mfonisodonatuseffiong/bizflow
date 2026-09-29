/*
  Warnings:

  - You are about to drop the column `businessId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BusinessType" ADD VALUE 'MECHANIC';
ALTER TYPE "BusinessType" ADD VALUE 'ELECTRICIAN';
ALTER TYPE "BusinessType" ADD VALUE 'PLUMBER';
ALTER TYPE "BusinessType" ADD VALUE 'CLEANER';
ALTER TYPE "BusinessType" ADD VALUE 'AC_TECHNICIAN';
ALTER TYPE "BusinessType" ADD VALUE 'TAILOR';
ALTER TYPE "BusinessType" ADD VALUE 'SALON_BARBER';
ALTER TYPE "BusinessType" ADD VALUE 'PHOTOGRAPHER';
ALTER TYPE "BusinessType" ADD VALUE 'REPAIR';

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_businessId_fkey";

-- DropIndex
DROP INDEX "User_businessId_idx";

-- AlterTable
ALTER TABLE "Business" ALTER COLUMN "country" DROP DEFAULT,
ALTER COLUMN "currency" DROP DEFAULT,
ALTER COLUMN "timezone" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "businessId",
DROP COLUMN "role",
ADD COLUMN     "passwordHash" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "BusinessMembership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STAFF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BusinessMembership_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BusinessMembership_businessId_idx" ON "BusinessMembership"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessMembership_userId_businessId_key" ON "BusinessMembership"("userId", "businessId");

-- AddForeignKey
ALTER TABLE "BusinessMembership" ADD CONSTRAINT "BusinessMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessMembership" ADD CONSTRAINT "BusinessMembership_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
