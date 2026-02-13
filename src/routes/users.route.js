const express = require("express");
const router = express.Router();
const controller = require("@/controllers/user.controller");
const { authRequired } = require("@/middlewares");

router.get("/search", authRequired, controller.searchUserByEmail);

module.exports = router;
