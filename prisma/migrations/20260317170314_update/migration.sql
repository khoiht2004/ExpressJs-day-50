/*
  Warnings:

  - Made the column `created_by` on table `conversations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `conversations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `uuid` on table `conversations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sender_id` on table `messages` required. This step will fail if there are existing NULL values in that column.
  - Made the column `content` on table `messages` required. This step will fail if there are existing NULL values in that column.
  - Made the column `type` on table `messages` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `messages` DROP FOREIGN KEY `messages_sender_id_fkey`;

-- DropIndex
DROP INDEX `messages_sender_id_fkey` ON `messages`;

-- AlterTable
ALTER TABLE `conversations` MODIFY `created_by` VARCHAR(255) NOT NULL,
    MODIFY `name` VARCHAR(255) NOT NULL,
    MODIFY `uuid` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `messages` MODIFY `sender_id` INTEGER UNSIGNED NOT NULL,
    MODIFY `content` VARCHAR(255) NOT NULL,
    MODIFY `type` VARCHAR(50) NOT NULL DEFAULT 'text';

-- AlterTable
ALTER TABLE `users` MODIFY `email` VARCHAR(255) NOT NULL,
    MODIFY `password` VARCHAR(255) NOT NULL;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
