/*
  Warnings:

  - A unique constraint covering the columns `[inviteCode]` on the table `servers` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `servers` MODIFY `inviteCode` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `servers_inviteCode_key` ON `servers`(`inviteCode`);
