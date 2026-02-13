const bcrypt = require("bcrypt");
const model = require("@/models/auth.model");
const AuthService = require("@/services/AuthService");

async function register(req, res) {
  const email = req.body.email;
  const saltRounds = 10;

  const password = await bcrypt.hash(req.body.password, saltRounds);
  const register = await model.register(email, password);

  if (!register) res.error(409, "Email already exists");

  res.success(201, register);
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) res.error(400, "Email and password are required");

  const user = await model.login(email);
  if (!user) res.error(401, "User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    const { accessToken, timeExp } = await AuthService.signAccessToken(user);

    return res.success(200, {
      id: user.id,
      email: user.email,
      access_token: accessToken,
      expired_at: timeExp,
    });
  }

  return res.error(401, "Invalid email or password");
}

async function getMe(req, res) {
  const user = req.currentUser;

  return res.success(200, {
    ...user,
    password: "Đố biết mật khẩu là gì ?",
  });
}

module.exports = { register, login, getMe };
