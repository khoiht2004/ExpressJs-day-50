/*
  Warnings:

  - The primary key for the `conversation_participants` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `conversation_id` on the `conversation_participants` table. The data in that column could be lost. The data in that column will be cast from `UnsignedInt` to `Int`.
  - You are about to alter the column `user_id` on the `conversation_participants` table. The data in that column could be lost. The data in that column will be cast from `UnsignedInt` to `Int`.
  - The primary key for the `conversations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `conversations` table. The data in that column could be lost. The data in that column will be cast from `UnsignedInt` to `Int`.
  - The primary key for the `messages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `messages` table. The data in that column could be lost. The data in that column will be cast from `UnsignedInt` to `Int`.
  - You are about to alter the column `conversation_id` on the `messages` table. The data in that column could be lost. The data in that column will be cast from `UnsignedInt` to `Int`.
  - You are about to alter the column `sender_id` on the `messages` table. The data in that column could be lost. The data in that column will be cast from `UnsignedInt` to `Int`.
  - The primary key for the `queues` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `queues` table. The data in that column could be lost. The data in that column will be cast from `UnsignedInt` to `Int`.
  - You are about to alter the column `is_priority` on the `queues` table. The data in that column could be lost. The data in that column will be cast from `UnsignedTinyInt` to `SmallInt`.
  - The primary key for the `refresh_tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `refresh_tokens` table. The data in that column could be lost. The data in that column will be cast from `UnsignedInt` to `Int`.
  - You are about to alter the column `user_id` on the `refresh_tokens` table. The data in that column could be lost. The data in that column will be cast from `UnsignedInt` to `Int`.
  - The primary key for the `revoked_tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `revoked_tokens` table. The data in that column could be lost. The data in that column will be cast from `UnsignedInt` to `Int`.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `users` table. The data in that column could be lost. The data in that column will be cast from `UnsignedInt` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `conversation_participants` DROP FOREIGN KEY `fk_conversation_participants_conversation_id`;

-- DropForeignKey
ALTER TABLE `conversation_participants` DROP FOREIGN KEY `fk_conversation_participants_user_id`;

-- DropForeignKey
ALTER TABLE `messages` DROP FOREIGN KEY `fk_messages_conversation_id`;

-- DropForeignKey
ALTER TABLE `messages` DROP FOREIGN KEY `messages_sender_id_fkey`;

-- DropIndex
DROP INDEX `fk_conversation_participants_conversation_id` ON `conversation_participants`;

-- DropIndex
DROP INDEX `messages_sender_id_fkey` ON `messages`;

-- AlterTable
ALTER TABLE `conversation_participants` DROP PRIMARY KEY,
    MODIFY `conversation_id` INTEGER NOT NULL,
    MODIFY `user_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`user_id`, `conversation_id`);

-- AlterTable
ALTER TABLE `conversations` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `created_by` VARCHAR(255) NULL,
    MODIFY `name` VARCHAR(255) NULL,
    MODIFY `created_at` TIMESTAMP(6) NULL,
    MODIFY `updated_at` TIMESTAMP(6) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `messages` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `conversation_id` INTEGER NOT NULL,
    MODIFY `sender_id` INTEGER NULL,
    MODIFY `content` VARCHAR(255) NULL,
    MODIFY `created_at` TIMESTAMP(6) NULL,
    MODIFY `updated_at` TIMESTAMP(6) NULL,
    MODIFY `type` VARCHAR(50) NULL DEFAULT 'text',
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `queues` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `created_at` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    MODIFY `updated_at` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    MODIFY `is_priority` SMALLINT NULL DEFAULT 0,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `refresh_tokens` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `user_id` INTEGER NULL,
    MODIFY `created_at` TIMESTAMP(6) NULL,
    MODIFY `updated_at` TIMESTAMP(6) NULL,
    MODIFY `expires_at` TIMESTAMP(6) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `revoked_tokens` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `expires_at` TIMESTAMP(6) NULL,
    MODIFY `created_at` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    MODIFY `updated_at` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `email` VARCHAR(255) NULL,
    MODIFY `password` VARCHAR(255) NULL,
    MODIFY `email_verified_at` TIMESTAMP(6) NULL,
    MODIFY `created_at` TIMESTAMP(6) NULL,
    MODIFY `updated_at` TIMESTAMP(6) NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `conversation_participants` ADD CONSTRAINT `conversation_participants_conversation_id_fkey` FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `conversation_participants` ADD CONSTRAINT `conversation_participants_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_conversation_id_fkey` FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `messages` RENAME INDEX `fk_messages_conversation_id` TO `messages_conversation_id_idx`;

-- RenameIndex
ALTER TABLE `users` RENAME INDEX `user_email` TO `users_email_key`;
