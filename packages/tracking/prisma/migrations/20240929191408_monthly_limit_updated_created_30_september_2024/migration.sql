/*
  Warnings:

  - Added the required column `updated` to the `MonthlyLimit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `MonthlyLimit` ADD COLUMN `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated` DATETIME(3) NOT NULL;
