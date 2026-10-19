/*
  Warnings:

  - You are about to alter the column `description` on the `Expense` table. The data in that column could be lost. The data in that column will be cast from `VarChar(256)` to `VarChar(128)`.

*/
-- AlterTable
ALTER TABLE `Expense` MODIFY `description` VARCHAR(128) NULL;
