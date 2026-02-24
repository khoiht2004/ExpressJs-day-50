SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for conversation_participants
-- ----------------------------
DROP TABLE IF EXISTS `conversation_participants`;
CREATE TABLE `conversation_participants`  (
  `conversation_id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  PRIMARY KEY (`user_id`, `conversation_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_520_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of conversation_participants
-- ----------------------------
INSERT INTO `conversation_participants` VALUES (1, 1);
INSERT INTO `conversation_participants` VALUES (2, 1);
INSERT INTO `conversation_participants` VALUES (4, 1);
INSERT INTO `conversation_participants` VALUES (7, 1);
INSERT INTO `conversation_participants` VALUES (1, 2);
INSERT INTO `conversation_participants` VALUES (2, 2);
INSERT INTO `conversation_participants` VALUES (3, 2);
INSERT INTO `conversation_participants` VALUES (4, 2);
INSERT INTO `conversation_participants` VALUES (7, 2);
INSERT INTO `conversation_participants` VALUES (2, 3);
INSERT INTO `conversation_participants` VALUES (3, 3);
INSERT INTO `conversation_participants` VALUES (7, 3);
INSERT INTO `conversation_participants` VALUES (7, 4);
INSERT INTO `conversation_participants` VALUES (7, 5);
INSERT INTO `conversation_participants` VALUES (7, 6);

-- ----------------------------
-- Table structure for conversations
-- ----------------------------
DROP TABLE IF EXISTS `conversations`;
CREATE TABLE `conversations`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `created_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL DEFAULT NULL,
  `type` enum('direct','group') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_520_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of conversations
-- ----------------------------
INSERT INTO `conversations` VALUES (1, '1', 'Chat 1-1 User1 & User2', 'direct', NULL);
INSERT INTO `conversations` VALUES (2, '1', 'Project Team', 'group', NULL);
INSERT INTO `conversations` VALUES (3, '2', 'Chat User2 & User3', 'direct', NULL);
INSERT INTO `conversations` VALUES (4, '2', 'Talkshow', 'direct', NULL);
INSERT INTO `conversations` VALUES (7, '2', 'Talkshow', 'group', NULL);

-- ----------------------------
-- Table structure for messages
-- ----------------------------
DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `conversation_id` int UNSIGNED NOT NULL,
  `sender_id` int NULL DEFAULT NULL,
  `content` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `fk_messages_conversation_id`(`conversation_id` ASC) USING BTREE,
  CONSTRAINT `fk_messages_conversation_id` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_520_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of messages
-- ----------------------------
INSERT INTO `messages` VALUES (1, 1, 1, 'Chào bạn, khỏe không?', NULL);
INSERT INTO `messages` VALUES (2, 1, 2, 'Mình khỏe, còn bạn?', NULL);
INSERT INTO `messages` VALUES (3, 2, 1, 'Chào mọi người, bắt đầu họp nhé', NULL);
INSERT INTO `messages` VALUES (4, 2, 3, 'Ok, mình vào rồi', NULL);
INSERT INTO `messages` VALUES (5, 3, 2, 'Hello User3', NULL);
INSERT INTO `messages` VALUES (6, 3, 3, 'Hi User2!', NULL);
INSERT INTO `messages` VALUES (7, 7, 4, 'Ê user2, t kể cho nghe cái này', '2026-02-13 11:15:24');
INSERT INTO `messages` VALUES (8, 7, 2, 'Ê user4, cái gì nói đi', '2026-02-13 11:15:46');
INSERT INTO `messages` VALUES (9, 7, 1, 'ABC ', '2026-02-13 11:33:28');
INSERT INTO `messages` VALUES (10, 7, 1, 'DEF', '2026-02-13 11:17:38');
INSERT INTO `messages` VALUES (11, 7, 2, 'ALO BLO CLO', '2026-02-13 11:21:05');
INSERT INTO `messages` VALUES (12, 7, 2, 'ALO BLO CLO', '2026-02-13 11:21:42');
INSERT INTO `messages` VALUES (13, 7, 2, 'ALO BLO CLO', '2026-02-13 11:22:18');
INSERT INTO `messages` VALUES (17, 7, 6, 'Test send message', '2026-02-20 15:51:53');
INSERT INTO `messages` VALUES (18, 7, 6, 'Test send message', '2026-02-20 15:52:14');

-- ----------------------------
-- Table structure for refresh_tokens
-- ----------------------------
DROP TABLE IF EXISTS `refresh_tokens`;
CREATE TABLE `refresh_tokens`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NULL DEFAULT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `expires_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 21 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_520_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for revoked_tokens
-- ----------------------------
DROP TABLE IF EXISTS `revoked_tokens`;
CREATE TABLE `revoked_tokens`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `token` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_520_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `user_email`(`email` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_520_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'user1@example.com', '$2b$10$EUgV2ML/Cl8qKLsMls7WRuxYF1PgXhe0XUkmqBpPeeEcT5RVdZv5K');
INSERT INTO `users` VALUES (2, 'user2@example.com', '$2b$10$qyUvVgVUwUC/xWkTCMW.CuA6.XqPnJl4iEgWUnuz0NKGU3qehsjna');
INSERT INTO `users` VALUES (3, 'user3@example.com', '$2b$10$jZ/xUlaSvqo2xrF6/rP63uC4N68MVD55KQDg204b7mg8zkhqdJt9G');
INSERT INTO `users` VALUES (4, 'user4@example.com', '$2b$10$hRc.7AZehzjImbp8z6yuEOgH7pQoMO.NbaR4iiY2xDshoYk6LNWEq');
INSERT INTO `users` VALUES (5, 'user5@example.com', '$2b$10$G8K1zhricjPNtaeViibUtuO6VzsLse3/q4loQVYeFsQVlS7bqcdy2');
INSERT INTO `users` VALUES (6, 'user6@example.com', '$2b$10$9bJN7JQWHlrGDO9Ytfr95OFMXIkW2JeB5Zwh38mCzAp2SB3LuL/62');
INSERT INTO `users` VALUES (7, 'user7@example.com', '$2b$10$/Qxvd3t8OGTGLkP.Z9rr6ulrQdofs8dQ4eD4rxbXVJyT6K/pJZyHu');

SET FOREIGN_KEY_CHECKS = 1;
