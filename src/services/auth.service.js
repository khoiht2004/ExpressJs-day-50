const jwt = require("jsonwebtoken");
const { authConfig } = require("@/config");
const base64 = require("@/utils/base64");
const crypto = require("node:crypto");
const generateKey = require("@/utils/generateKey");
const model = require("@/models/auth.model");
const prisma = require("@/libs/prisma");
const bcrypt = require("bcrypt");
const queueService = require("@/services/queue.service");

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
      authConfig.jwtSecret,
    );
    return {
      accessToken,
      timeExp,
    };
  }

  async verifyAccessToken(accessToken) {
    return await jwt.verify(accessToken, authConfig.jwtSecret);
  }

  async createRefreshToken(user) {
    const refreshToken = generateKey();
    const timeExp = new Date(Date.now() + 60 * 60 * 24 * 7); // Token hết hạn sau 7 ngày
    await model.createRefreshToken(user.id, refreshToken, timeExp);
    return refreshToken;
  }

  async verifyEmail(token) {
    const payload = await jwt.verify(token, authConfig.verifyJwtSecret);

    if (payload.exp < Date.now() / 1000) return [true, null];

    const userId = payload.sub;

    const count = await prisma.user.count({
      where: {
        id: userId,
        emailVerifiedAt: { not: null },
      },
    });

    if (count > 0) return [true, null];

    await prisma.user.update({
      where: { id: userId },
      data: { emailVerifiedAt: new Date() },
    });
    return [false, null];
  }

  async changePassword(user, old_password, new_password, confirm_password) {
    if (!old_password || !new_password || !confirm_password) {
      return ["All fields are required", null];
    }

    const hashedPasswordDB = await model.getUserPasswordById(user.id);
    const isMatch = await bcrypt.compare(old_password, hashedPasswordDB);
    if (!isMatch) {
      return ["Invalid old password", null];
    }

    if (new_password === old_password) {
      return ["New password must be different from old password", null];
    }

    if (new_password !== confirm_password) {
      return ["Passwords do not match", null];
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await model.changePassword(user.id, hashedPassword);

    // Send password change email
    await queueService.push(
      "sendPasswordChangeEmail",
      { id: user.id, email: user.email },
      1,
    );

    return [null, "Password changed successfully"];
  }
}

module.exports = new AuthService();
