/*
  Warnings:

  - A unique constraint covering the columns `[businessId,requestId]` on the table `Sale` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "requestId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Sale_businessId_requestId_key" ON "Sale"("businessId", "requestId");
