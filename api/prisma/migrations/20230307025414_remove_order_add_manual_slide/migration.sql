/*
  Warnings:

  - You are about to drop the column `order` on the `Slide` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Presentation" ADD COLUMN     "manualSlideId" TEXT;

-- AlterTable
ALTER TABLE "Slide" DROP COLUMN "order";

-- AddForeignKey
ALTER TABLE "Presentation" ADD CONSTRAINT "Presentation_manualSlideId_fkey" FOREIGN KEY ("manualSlideId") REFERENCES "Slide"("id") ON DELETE SET NULL ON UPDATE CASCADE;
