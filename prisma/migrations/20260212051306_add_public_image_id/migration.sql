/*
  Warnings:

  - Added the required column `imagePublicId` to the `Crosshair` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Crosshair" ADD COLUMN     "imagePublicId" TEXT;


UPDATE "Crosshair" SET "imagePublicId" = '' WHERE "imagePublicId" IS NULL;
   

ALTER TABLE "Crosshair" ALTER COLUMN "imagePublicId" SET NOT NULL;