/*
  Warnings:

  - Added the required column `earned` to the `Invest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Invest` ADD COLUMN `earned` DOUBLE NOT NULL;
