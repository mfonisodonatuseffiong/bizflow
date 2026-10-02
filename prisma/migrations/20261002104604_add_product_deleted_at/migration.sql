-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Product_businessId_deletedAt_createdAt_idx" ON "Product"("businessId", "deletedAt", "createdAt");
