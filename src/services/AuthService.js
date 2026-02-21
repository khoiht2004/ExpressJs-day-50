const jwt = require("jsonwebtoken");
const { auth } = require("@/config");
const base64 = require("@/utils/base64");
const crypto = require("node:crypto");

const jwt2 = {
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
}

module.exports = new AuthService();
