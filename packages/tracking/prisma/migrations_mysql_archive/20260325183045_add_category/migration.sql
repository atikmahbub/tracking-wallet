-- AlterTable
ALTER TABLE `Expense` ADD COLUMN `categoryId` BINARY(16) NULL;

-- CreateTable
CREATE TABLE `Category` (
    `id` BINARY(16) NOT NULL,
    `name` VARCHAR(128) NOT NULL,
    `icon` VARCHAR(128) NOT NULL,
    `color` VARCHAR(32) NOT NULL,
    `type` ENUM('EXPENSE', 'INCOME') NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NULL,

    INDEX `category_type_index`(`type`),
    INDEX `category_user_id_index`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `expense_category_id_index` ON `Expense`(`categoryId`);

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
