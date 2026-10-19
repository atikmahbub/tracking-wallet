-- CreateTable
CREATE TABLE `Loan` (
    `id` BINARY(16) NOT NULL,
    `loanType` ENUM('GIVEN', 'TAKEN') NOT NULL,
    `name` VARCHAR(128) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `deadLine` DATETIME(3) NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
