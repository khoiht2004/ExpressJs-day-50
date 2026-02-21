const { Buffer } = require("node:buffer");

// Mã hóa
const encode = (str, safeUrl = false) => {
  return Buffer.from(str).toString(safeUrl ? "base64url" : "base64");
};

// Giải mã
const decode = (base64Str, safeUrl = false) => {
  return Buffer.from(base64Str, safeUrl ? "base64url" : "base64").toString(
    "utf8",
  );
};

module.exports = { encode, decode };
