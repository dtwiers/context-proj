/*
  Warnings:

  - A unique constraint covering the columns `[eventId,order]` on the table `Slide` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `eventId` to the `Slide` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Slide` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Slide" ADD COLUMN     "eventId" TEXT NOT NULL,
ADD COLUMN     "footer" TEXT,
ADD COLUMN     "header" TEXT,
ADD COLUMN     "order" INTEGER NOT NULL,
ADD COLUMN     "subtitle" TEXT,
ADD COLUMN     "title" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Slide_eventId_order_key" ON "Slide"("eventId", "order");

-- AddForeignKey
ALTER TABLE "Slide" ADD CONSTRAINT "Slide_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
