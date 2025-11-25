/*
  Warnings:

  - A unique constraint covering the columns `[Email]` on the table `UserLoginData` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserLoginData_Email_key" ON "UserLoginData"("Email");
