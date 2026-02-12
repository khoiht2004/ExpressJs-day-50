const model = require("@/models/auth.model");
const AuthService = require("@/services/AuthService");

async function authRequired(req, res, next) {
  const accessToken = req.headers?.authorization?.replace("Bearer ", "").trim();
  const payload = await AuthService.verifyAccessToken(accessToken);

  if (payload.exp < Date.now() / 1000) res.error(401, "Token expired");

  const user = await model.getUserById(payload.sub);
  if (!user) res.error(401, "User not found");

  req.currentUser = user;

  next();
}

module.exports = authRequired;
