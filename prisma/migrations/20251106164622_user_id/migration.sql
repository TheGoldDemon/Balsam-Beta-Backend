/*
  Warnings:

  - You are about to drop the column `id2` on the `UserMedicine` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,UserId]` on the table `UserMedicine` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `UserId` to the `UserMedicine` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UserMedicine_id_id2_key";

-- AlterTable
ALTER TABLE "UserMedicine" DROP COLUMN "id2",
ADD COLUMN     "UserId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserMedicine_id_UserId_key" ON "UserMedicine"("id", "UserId");
