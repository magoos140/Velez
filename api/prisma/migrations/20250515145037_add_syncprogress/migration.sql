-- CreateTable
CREATE TABLE `SyncProgress` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `lastPage` INTEGER NOT NULL DEFAULT 0,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
