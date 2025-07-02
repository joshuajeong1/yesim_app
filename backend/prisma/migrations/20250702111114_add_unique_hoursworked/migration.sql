/*
  Warnings:

  - A unique constraint covering the columns `[userId,payPeriodId]` on the table `HoursWorked` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "HoursWorked_userId_payPeriodId_key" ON "HoursWorked"("userId", "payPeriodId");
