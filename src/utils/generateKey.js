const crypto = require("node:crypto");

function generateKey(size = 40, encoding = "hex") {
  return crypto.randomBytes(size).toString(encoding);
}

module.exports = generateKey;
