const bcrypt = require("bcrypt");
const model = require("@/models/auth.model");
const AuthService = require("@/services/auth.service");
const QueueService = require("@/services/queue.service");

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
  const user = await model.register(email, hashedPassword);

  if (!user) return res.error(409, "Email already exists");

  // Send verification email
  await QueueService.push("sendVerificationEmail", {
    id: user.id,
    email: user.email,
  });

  await AuthService.signAccessToken(user);

  return res.success(201, {
    message: "Register successfully",
    id: user.id,
    email: user.email,
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.error(400, "Email and password are required");

  const user = await model.login(email);
  if (!user) return res.error(401, "Email or password is invalid");

  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    if (!user.emailVerifiedAt) {
      return res.error(403, "Account not verified");
    }

    const { accessToken, timeExp } = await AuthService.signAccessToken(user);
    const refreshToken = await AuthService.createRefreshToken(user);

    return res.success(200, {
      id: user.id,
      email: user.email,
      access_token: accessToken,
      expired_at: timeExp,
      refresh_token: refreshToken,
    });
  }

  return res.error(401, "Invalid email or password");
}

async function getMe(req, res) {
  const { user } = req.auth;

  return res.success(200, user);
}

async function logout(req, res) {
  const { accessToken, payload } = req.auth;
  const expiresAt = new Date(payload.exp * 1000);

  await model.logout(accessToken, expiresAt);
  res.success(204, null);
}

async function refreshToken(req, res) {
  const { refresh_token } = req.body;
  if (!refresh_token) res.error(400, "Refresh token is required");

  const refreshTokenDB = await model.getRefreshToken(refresh_token);
  if (!refreshTokenDB) res.error(401, "Refresh token is invalid");

  const user = await model.getUserById(refreshTokenDB[0].userId);

  const { accessToken } = await AuthService.signAccessToken(user);
  const refreshToken = await AuthService.createRefreshToken(user);

  return res.success(200, {
    access_token: accessToken,
    refresh_token: refreshToken,
  });
}

async function verifyEmail(req, res) {
  const { token } = req.body;
  if (!token) res.error(400, "Token is required");

  const [error, data] = await AuthService.verifyEmail(token);

  if (error) return res.error(403, "Invalid token");

  res.success(200, "Email verified successfully");
}

async function changePassword(req, res) {
  const { old_password, new_password, confirm_password } = req.body;
  const { user } = req.auth;

  const [error, data] = await AuthService.changePassword(
    user,
    old_password,
    new_password,
    confirm_password,
  );

  if (error) return res.error(400, error);

  return res.success(200, data);
}

module.exports = {
  register,
  login,
  getMe,
  logout,
  refreshToken,
  verifyEmail,
  changePassword,
};
