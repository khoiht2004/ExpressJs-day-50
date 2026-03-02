const db = require("@/database/database");

async function cleanupExpiredTokens() {
  const [{ affectedRows }] = await db.execute(
    "DELETE FROM revoked_tokens WHERE expires_at < NOW()",
  );

  console.log(`Cleanup ${affectedRows} expired tokens`);
}

module.exports = cleanupExpiredTokens;
