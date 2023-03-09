/*
  Warnings:

  - You are about to drop the column `name` on the `Asset` table. All the data in the column will be lost.
  - Added the required column `filename` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "name",
ADD COLUMN     "filename" TEXT NOT NULL,
ADD COLUMN     "label" TEXT NOT NULL,
ADD COLUMN     "thumbnailName" TEXT;
