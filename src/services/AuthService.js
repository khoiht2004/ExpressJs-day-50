const jwt = require("jsonwebtoken");
const { auth } = require("@/config");

class AuthService {
  async signAccessToken(user) {
    const timeExp = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // Token hết hạn sau 1 ngày
    const accessToken = await jwt.sign(
      {
        sub: user.id,
        exp: timeExp,
      },
      auth.jwtSecret,
    );
    return {
      accessToken,
      timeExp,
    };
  }

  async verifyAccessToken(accessToken) {
    return await jwt.verify(accessToken, auth.jwtSecret);
  }
}

module.exports = new AuthService();
