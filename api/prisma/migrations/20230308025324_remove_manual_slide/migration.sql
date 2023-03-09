/*
  Warnings:

  - You are about to drop the column `manualSlideId` on the `Presentation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Presentation" DROP CONSTRAINT "Presentation_manualSlideId_fkey";

-- AlterTable
ALTER TABLE "Presentation" DROP COLUMN "manualSlideId";
