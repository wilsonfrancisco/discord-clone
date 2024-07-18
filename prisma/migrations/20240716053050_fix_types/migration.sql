-- AlterTable
ALTER TABLE `profiles` MODIFY `imageUrl` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `servers` MODIFY `imageUrl` TEXT NOT NULL,
    MODIFY `inviteCode` TEXT NOT NULL;
