const db = require("@/database/database");

const isRevoked = async (token) => {
  const [rows] = await db.query(
    "SELECT count(*) as count FROM revoked_tokens WHERE token = ?",
    [token],
  );
  if (rows.length === 0) return false;
  return rows[0]["count"];
};

module.exports = { isRevoked };
