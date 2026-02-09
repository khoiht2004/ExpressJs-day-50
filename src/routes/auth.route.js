const router = require("express").Router();

router.use("/auth", (req, res, next) => {
  next();
});

router.post("/register", (req, res) => {
  res.send("Register");
});

module.exports = router;
