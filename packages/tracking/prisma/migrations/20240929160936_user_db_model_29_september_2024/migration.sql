/*
  Warnings:

  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `full_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_picture` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `createdAt`,
    DROP COLUMN `name`,
    ADD COLUMN `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `full_name` VARCHAR(256) NOT NULL,
    ADD COLUMN `profile_picture` VARCHAR(191) NOT NULL,
    ADD COLUMN `updated` DATETIME(3) NOT NULL,
    MODIFY `email` VARCHAR(256) NOT NULL;

-- CreateIndex
CREATE INDEX `user_email_index` ON `User`(`email`);
