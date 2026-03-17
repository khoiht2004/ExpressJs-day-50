-- AlterTable
ALTER TABLE `conversations` MODIFY `type` ENUM('direct', 'group') NOT NULL DEFAULT 'direct';
