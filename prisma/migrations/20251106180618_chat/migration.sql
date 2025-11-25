/*
  Warnings:

  - Added the required column `Name` to the `UserChat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserChat" ADD COLUMN     "Name" TEXT NOT NULL;
