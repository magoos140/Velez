/*
  Warnings:

  - You are about to drop the column `cityDest` on the `shipment` table. All the data in the column will be lost.
  - You are about to drop the column `invoicedDate` on the `shipment` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `shipment` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `shipment` table. All the data in the column will be lost.
  - You are about to drop the column `warehouseId` on the `shipment` table. All the data in the column will be lost.
  - Added the required column `city_id` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiced_date` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_id` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `warehouse_id` to the `Shipment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `shipment` DROP COLUMN `cityDest`,
    DROP COLUMN `invoicedDate`,
    DROP COLUMN `orderId`,
    DROP COLUMN `productId`,
    DROP COLUMN `warehouseId`,
    ADD COLUMN `city_id` INTEGER NOT NULL,
    ADD COLUMN `invoiced_date` DATETIME(3) NOT NULL,
    ADD COLUMN `order_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `product_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `warehouse_id` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Order` (
    `order_id` VARCHAR(191) NOT NULL,
    `creation_date` DATETIME(3) NOT NULL,
    `invoiced_date` DATETIME(3) NULL,
    `total_value` DOUBLE NULL,
    `status` VARCHAR(191) NULL,

    PRIMARY KEY (`order_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `product_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `skuName` VARCHAR(191) NULL,

    PRIMARY KEY (`product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Warehouse` (
    `warehouse_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,

    PRIMARY KEY (`warehouse_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `City` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,

    UNIQUE INDEX `City_name_state_country_key`(`name`, `state`, `country`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Shipment_product_id_idx` ON `Shipment`(`product_id`);

-- CreateIndex
CREATE INDEX `Shipment_warehouse_id_idx` ON `Shipment`(`warehouse_id`);

-- CreateIndex
CREATE INDEX `Shipment_city_id_idx` ON `Shipment`(`city_id`);

-- CreateIndex
CREATE INDEX `Shipment_invoiced_date_idx` ON `Shipment`(`invoiced_date`);

-- AddForeignKey
ALTER TABLE `Shipment` ADD CONSTRAINT `Shipment_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shipment` ADD CONSTRAINT `Shipment_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shipment` ADD CONSTRAINT `Shipment_warehouse_id_fkey` FOREIGN KEY (`warehouse_id`) REFERENCES `Warehouse`(`warehouse_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shipment` ADD CONSTRAINT `Shipment_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
