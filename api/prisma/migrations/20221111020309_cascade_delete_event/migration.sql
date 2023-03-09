-- DropForeignKey
ALTER TABLE "Presentation" DROP CONSTRAINT "Presentation_eventId_fkey";

-- AddForeignKey
ALTER TABLE "Presentation" ADD CONSTRAINT "Presentation_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
