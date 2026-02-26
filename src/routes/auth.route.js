const router = require("express").Router();
const controller = require("@/controllers/auth.controller");
const authRequired = require("@/middlewares/authRequired");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/me", authRequired, controller.getMe);
router.post("/refresh-token", controller.refreshToken);
router.post("/logout", authRequired, controller.logout);
router.post("/verify-email", controller.verifyEmail);

module.exports = router;
