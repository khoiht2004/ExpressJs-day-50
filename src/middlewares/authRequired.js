const authModel = require("@/models/auth.model");
const revokedTokenModel = require("@/models/revokedToken.model");
const AuthService = require("@/services/AuthService");

async function authRequired(req, res, next) {
  const accessToken = req.headers?.authorization?.replace("Bearer ", "").trim();
  const payload = await AuthService.verifyAccessToken(accessToken);

  const isRevoked = await revokedTokenModel.isRevoked(accessToken);

  if (isRevoked || payload.exp < Date.now() / 1000)
    res.error(401, "Unauthorized");

  const user = await authModel.getUserById(payload.sub);
  if (!user) res.error(401, "User not found");

  req.currentUser = user;
  req.accessToken = accessToken;
  req.tokenPayload = payload;

  next();
}

module.exports = authRequired;
