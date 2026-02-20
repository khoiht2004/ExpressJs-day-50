const db = require("@/database/database");

async function searchUserByEmail(currentUserEmail, q) {
  const users = await db.query(
    `SELECT id, email from users WHERE email LIKE ? AND email != ? `,
    [`%${q}%`, currentUserEmail],
  );
  return users;
}

module.exports = { searchUserByEmail };
