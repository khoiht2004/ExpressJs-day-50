const router = require("express").Router();
const controller = require("@/controllers/auth.controller");
const authRequired = require("@/middlewares/authRequired");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/me", authRequired, controller.getMe);

module.exports = router;
