const bcrypt = require("bcrypt");
const model = require("@/models/auth.model");
const AuthService = require("@/services/AuthService");

async function register(req, res) {
  const { email, password } = req.body;
  const saltRounds = 10;

  // Kiểm tra email và password không rỗng
  if (!email || !password) {
    return res.error(400, "Email and password are required");
  }

  // Kiểm tra định dạng email đơn giản (kiểm tra có @ và .)
  const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
  if (!emailRegex.test(email)) {
    return res.error(400, "Invalid email format");
  }

  // Kiểm tra password không quá ngắn
  if (password.length < 6) {
    return res.error(400, "Password must be at least 6 characters");
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const users = await model.register(email, hashedPassword);

  const user = users[0];
  if (!user) res.error(409, "Email already exists");

  const { accessToken, timeExp } = await AuthService.signAccessToken(user);

  return res.success(201, {
    id: user.id,
    email: user.email,
    access_token: accessToken,
    expired_at: timeExp,
  });
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

async function refreshToken(req, res) {}

module.exports = { register, login, getMe, refreshToken };
