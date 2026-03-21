const express = require("express");
const router = express.Router();
const controller = require("@/controllers/conversation.controller");
const { authRequired } = require("@/middlewares");

router.post("/", authRequired, controller.create);
router.get("/", authRequired, controller.getAll);
// Tự động tạo direct conversation khi người dùng nhắn tin NẾU CHƯA CÓ
router.post("/direct-messages", authRequired, controller.createDirectMessages);

router.post("/:id/participants", authRequired, controller.addParticipants);
router.post("/:id/messages", authRequired, controller.sendMessages);
router.get("/:id/messages", authRequired, controller.getMessages);

module.exports = router;
