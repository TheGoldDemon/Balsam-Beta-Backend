/*
  Warnings:

  - A unique constraint covering the columns `[id,id2]` on the table `UserMedicine` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserMedicine_id_id2_key" ON "UserMedicine"("id", "id2");
