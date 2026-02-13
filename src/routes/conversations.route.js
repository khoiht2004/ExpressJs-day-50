const express = require("express");
const router = express.Router();
const controller = require("@/controllers/conversation.controller");
const { authRequired } = require("@/middlewares");

router.post("/", authRequired, controller.create);
router.get("/", authRequired, controller.getAll);
router.post("/:id/participants", authRequired, controller.addParticipants);
router.post("/:id/messages", authRequired, controller.sendMessages);
router.get("/:id/messages", authRequired, controller.getMessages);

module.exports = router;
