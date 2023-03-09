-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "currentSlideId" TEXT;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_currentSlideId_fkey" FOREIGN KEY ("currentSlideId") REFERENCES "Slide"("id") ON DELETE SET NULL ON UPDATE CASCADE;
