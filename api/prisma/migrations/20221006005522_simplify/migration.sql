/*
  Warnings:

  - You are about to drop the `EventScreenData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScreenData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScreenLayout` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScreenLayoutElement` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EventScreenData" DROP CONSTRAINT "EventScreenData_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventScreenData" DROP CONSTRAINT "EventScreenData_screenDataId_fkey";

-- DropForeignKey
ALTER TABLE "ScreenLayoutElement" DROP CONSTRAINT "ScreenLayoutElement_assetId_fkey";

-- DropForeignKey
ALTER TABLE "ScreenLayoutElement" DROP CONSTRAINT "ScreenLayoutElement_screenLayoutId_fkey";

-- DropTable
DROP TABLE "EventScreenData";

-- DropTable
DROP TABLE "ScreenData";

-- DropTable
DROP TABLE "ScreenLayout";

-- DropTable
DROP TABLE "ScreenLayoutElement";
