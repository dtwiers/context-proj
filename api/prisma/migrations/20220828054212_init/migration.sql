-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "screenHeight" INTEGER NOT NULL,
    "screenWidth" INTEGER NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScreenLayout" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "screenHeight" INTEGER NOT NULL DEFAULT 1080,
    "screenWidth" INTEGER NOT NULL DEFAULT 1920,

    CONSTRAINT "ScreenLayout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScreenLayoutElement" (
    "id" TEXT NOT NULL,
    "screenLayoutId" TEXT NOT NULL,
    "top" INTEGER NOT NULL,
    "left" INTEGER NOT NULL,
    "styles" JSONB NOT NULL,
    "text" TEXT,
    "assetId" TEXT,

    CONSTRAINT "ScreenLayoutElement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventScreenData" (
    "eventId" TEXT NOT NULL,
    "screenDataId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "EventScreenData_pkey" PRIMARY KEY ("eventId","screenDataId")
);

-- CreateTable
CREATE TABLE "ScreenData" (
    "id" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "ScreenData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "data" BYTEA NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ScreenLayoutElement" ADD CONSTRAINT "ScreenLayoutElement_screenLayoutId_fkey" FOREIGN KEY ("screenLayoutId") REFERENCES "ScreenLayout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScreenLayoutElement" ADD CONSTRAINT "ScreenLayoutElement_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventScreenData" ADD CONSTRAINT "EventScreenData_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventScreenData" ADD CONSTRAINT "EventScreenData_screenDataId_fkey" FOREIGN KEY ("screenDataId") REFERENCES "ScreenData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
