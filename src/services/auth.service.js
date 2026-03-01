const jwt = require("jsonwebtoken");
const { auth } = require("@/config");
const base64 = require("@/utils/base64");
const crypto = require("node:crypto");
const generateKey = require("@/utils/generateKey");
const model = require("@/models/auth.model");
const db = require("@/database/database");

/**
 * JWT bảo mật và chống giả mạo nhờ phần Signature (chữ ký).
 * Chữ ký được tạo bằng cách băm (hash) tổ hợp Header + Payload cùng với một Secret Key bí mật.
 * Nếu bất kỳ thông tin nào trong Header hoặc Payload bị thay đổi, chữ ký sẽ không còn khớp,
 * giúp server phát hiện ngay lập tức hành vi giả mạo.
 */
const jwt2 = {
  // Ký token
  sign(payload, secret) {
    // Header
    const jsonHeader = JSON.stringify({ typ: "JWT", alg: "HS256" });
    const encodeHeader = base64.encode(jsonHeader, true);

    // Payload
    const jsonPayload = JSON.stringify(payload);
    const encodePayload = base64.encode(jsonPayload, true);

    // Signature
    const hmac = crypto.createHmac("sha256", secret);
    const signature = hmac
      .update(`${encodeHeader}.${encodePayload}`)
      .digest("base64url");

    // Token
    const accessToken = `${encodeHeader}.${encodePayload}.${signature}`;

    return accessToken;
  },
  // Ký lại signature và so sánh với signature được gửi lên từ client -> Nếu khác nhau -> Invalid token
  verify(token, secret) {
    const [encodeHeader, encodePayload, oldSignature] = token?.split(".");
    // Signature
    const hmac = crypto.createHmac("sha256", secret);
    const newSignature = hmac
      .update(`${encodeHeader}.${encodePayload}`)
      .digest("base64url");

    if (newSignature !== oldSignature) throw new Error("Invalid token");

    return JSON.parse(base64.decode(encodePayload, true));
  },
};

class AuthService {
  async signAccessToken(user) {
    const timeExp = Math.floor(Date.now() / 1000) + 60 * 60; // Token hết hạn sau 1h
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

  async createRefreshToken(user) {
    const refreshToken = generateKey();
    const timeExp = new Date(Date.now() + 60 * 60 * 24 * 7); // Token hết hạn sau 7 ngày
    await model.createRefreshToken(user.id, refreshToken, timeExp);
    return refreshToken;
  }

  async verifyEmail(token) {
    const payload = await jwt.verify(token, auth.verifyJwtSecret);

    if (payload.exp < Date.now() / 1000) return [true, null];

    const userId = payload.sub;

    const query =
      "SELECT COUNT(*) AS count FROM users WHERE id = ? AND email_verified_at IS NOT NULL";
    const [[{ count }]] = await db.query(query, [userId]);

    if (count > 0) return [true, null];

    await db.query("UPDATE users SET email_verified_at = now() WHERE id = ?", [
      userId,
    ]);
    return [false, null];
  }
}

module.exports = new AuthService();
