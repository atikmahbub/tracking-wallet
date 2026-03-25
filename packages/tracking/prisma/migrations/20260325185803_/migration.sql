/*
  Warnings:

  - You are about to drop the column `type` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Category` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Category` DROP FOREIGN KEY `Category_userId_fkey`;

-- DropIndex
DROP INDEX `category_type_index` ON `Category`;

-- AlterTable
ALTER TABLE `Category` DROP COLUMN `type`,
    DROP COLUMN `userId`;

-- CreateIndex
CREATE UNIQUE INDEX `Category_name_key` ON `Category`(`name`);
