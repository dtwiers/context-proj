/*
  Warnings:

  - You are about to drop the column `currentSlideId` on the `Event` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PresentationMode" AS ENUM ('INVISIBLE', 'EMPTY', 'MANUAL', 'SLIDE');

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_currentSlideId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "currentSlideId";

-- CreateTable
CREATE TABLE "Presentation" (
    "id" TEXT NOT NULL,
    "assetId" TEXT,
    "mode" "PresentationMode" NOT NULL,
    "header" TEXT,
    "footer" TEXT,
    "title" TEXT,
    "subtitle" TEXT,
    "eventId" TEXT NOT NULL,
    "slideId" TEXT,

    CONSTRAINT "Presentation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Presentation_eventId_key" ON "Presentation"("eventId");

-- AddForeignKey
ALTER TABLE "Presentation" ADD CONSTRAINT "Presentation_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presentation" ADD CONSTRAINT "Presentation_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presentation" ADD CONSTRAINT "Presentation_slideId_fkey" FOREIGN KEY ("slideId") REFERENCES "Slide"("id") ON DELETE SET NULL ON UPDATE CASCADE;
