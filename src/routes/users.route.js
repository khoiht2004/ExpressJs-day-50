const express = require("express");
const router = express.Router();
const controller = require("@/controllers/user.controller");
const { authRequired } = require("@/middlewares");

router.get("/search", authRequired, controller.searchUserByEmail);
router.get("/search-by-name", authRequired, controller.searchUserByName);

module.exports = router;
