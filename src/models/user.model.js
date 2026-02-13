const db = require("@/database/database");

async function searchUserByEmail(email1, email2) {
  const users = await db.query(
    `
    SELECT id, email from users
    WHERE  email != ? AND email = ? `,
    [email1, email2],
  );
  return users;
}

module.exports = { searchUserByEmail };
