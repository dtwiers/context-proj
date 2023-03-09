-- DropForeignKey
ALTER TABLE "Slide" DROP CONSTRAINT "Slide_eventId_fkey";

-- AddForeignKey
ALTER TABLE "Slide" ADD CONSTRAINT "Slide_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
