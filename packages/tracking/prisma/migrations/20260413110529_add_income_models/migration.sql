-- CreateTable
CREATE TABLE `Income` (
    `id` BINARY(16) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `description` VARCHAR(128) NULL,
    `date` DATETIME(3) NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `categoryId` BINARY(16) NULL,

    INDEX `income_user_id_date_index`(`userId`, `date`),
    INDEX `income_category_id_index`(`categoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IncomeCategory` (
    `id` BINARY(16) NOT NULL,
    `name` VARCHAR(128) NOT NULL,
    `icon` VARCHAR(128) NOT NULL,
    `color` VARCHAR(32) NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NULL,

    UNIQUE INDEX `IncomeCategory_name_userId_key`(`name`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Income` ADD CONSTRAINT `Income_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Income` ADD CONSTRAINT `Income_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `IncomeCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IncomeCategory` ADD CONSTRAINT `IncomeCategory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
