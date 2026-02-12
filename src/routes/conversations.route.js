const express = require("express");
const router = express.Router();
const controller = require("@/controllers/conversation.controller");
const { authRequired } = require("@/middlewares");

router.post("/", authRequired, controller.create);

module.exports = router;
