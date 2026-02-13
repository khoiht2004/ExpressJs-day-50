const db = require("@/database/database");

const register = async (email, password) => {
  const [rows] = await db.query("SELECT email FROM users WHERE email = ?", [
    email,
  ]);
  if (rows.length > 0) return null;

  const [{ insertId }] = await db.execute(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, password],
  );
  const [users] = await db.query("SELECT id, email FROM users WHERE id = ?", [
    insertId,
  ]);

  return {
    id: users[0].id,
    email: users[0].email,
  };
};

const login = async (email) => {
  const [rows] = await db.query(
    "SELECT id, email, password FROM users WHERE email = ?",
    [email],
  );
  if (rows.length === 0) return null;
  return rows[0];
};

const getUserById = async (id) => {
  const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
  if (rows.length === 0) return null;
  return rows[0];
};

module.exports = { login, register, getUserById };
