/*
  Warnings:

  - The primary key for the `conversation_participants` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `conversations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uuid` on the `conversations` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `conversation_participants` DROP FOREIGN KEY `conversation_participants_conversation_id_fkey`;

-- DropForeignKey
ALTER TABLE `messages` DROP FOREIGN KEY `messages_conversation_id_fkey`;

-- DropIndex
DROP INDEX `conversation_participants_conversation_id_fkey` ON `conversation_participants`;

-- AlterTable
ALTER TABLE `conversation_participants` DROP PRIMARY KEY,
    MODIFY `conversation_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`user_id`, `conversation_id`);

-- AlterTable
ALTER TABLE `conversations` DROP PRIMARY KEY,
    DROP COLUMN `uuid`,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `messages` MODIFY `conversation_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `conversation_participants` ADD CONSTRAINT `conversation_participants_conversation_id_fkey` FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_conversation_id_fkey` FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
