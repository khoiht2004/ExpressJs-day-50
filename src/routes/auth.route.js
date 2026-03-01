const router = require("express").Router();
const controller = require("@/controllers/auth.controller");
const authRequired = require("@/middlewares/authRequired");

// AUTH ROUTES
router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/refresh-token", controller.refreshToken);
router.post("/verify-email", controller.verifyEmail);

// PROTECTED ROUTES
router.get("/me", authRequired, controller.getMe);
router.post("/logout", authRequired, controller.logout);
router.post("/change-password", authRequired, controller.changePassword);

module.exports = router;
