/*
  Warnings:

  - You are about to drop the column `receiverId` on the `conversations` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `conversations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[memberTwoId,memberOneId]` on the table `conversations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `memberOneId` to the `conversations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memberTwoId` to the `conversations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `conversations` DROP FOREIGN KEY `conversations_receiverId_fkey`;

-- DropForeignKey
ALTER TABLE `conversations` DROP FOREIGN KEY `conversations_senderId_fkey`;

-- DropIndex
DROP INDEX `conversations_senderId_receiverId_key` ON `conversations`;

-- AlterTable
ALTER TABLE `conversations` DROP COLUMN `receiverId`,
    DROP COLUMN `senderId`,
    ADD COLUMN `memberOneId` VARCHAR(191) NOT NULL,
    ADD COLUMN `memberTwoId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `conversations_memberTwoId_idx` ON `conversations`(`memberTwoId`);

-- CreateIndex
CREATE INDEX `conversations_memberOneId_idx` ON `conversations`(`memberOneId`);

-- CreateIndex
CREATE UNIQUE INDEX `conversations_memberTwoId_memberOneId_key` ON `conversations`(`memberTwoId`, `memberOneId`);

-- AddForeignKey
ALTER TABLE `conversations` ADD CONSTRAINT `conversations_memberOneId_fkey` FOREIGN KEY (`memberOneId`) REFERENCES `members`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conversations` ADD CONSTRAINT `conversations_memberTwoId_fkey` FOREIGN KEY (`memberTwoId`) REFERENCES `members`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
