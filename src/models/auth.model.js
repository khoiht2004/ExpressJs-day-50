const db = require("@/database/database");

const register = async (email, password) => {
  const [rows] = await db.query("SELECT email FROM users WHERE email = ?", [
    email,
  ]);
  if (rows.length > 0) return null;

  const [{ insertId }] = await db.execute(
    "INSERT INTO users (email, password, created_at) VALUES (?, ?, NOW())",
    [email, password],
  );
  const [users] = await db.query("SELECT id, email FROM users WHERE id = ?", [
    insertId,
  ]);

  return users[0];
};

const login = async (email) => {
  const [rows] = await db.query(
    "SELECT id, email, password, email_verified_at FROM users WHERE email = ?",
    [email],
  );
  if (rows.length === 0) return null;
  return rows[0];
};

const getUserById = async (id) => {
  const [rows] = await db.query("SELECT id, email FROM users WHERE id = ?", [
    id,
  ]);
  if (rows.length === 0) return null;
  return rows[0];
};

const getUserPasswordById = async (id) => {
  const [rows] = await db.query("SELECT password FROM users WHERE id = ?", [
    id,
  ]);
  if (rows.length === 0) return null;
  return rows[0].password;
};

const logout = async (token, expiresAt) => {
  const result = await db.execute(
    "INSERT INTO revoked_tokens (token, expires_at) VALUES (?, ?)",
    [token, expiresAt],
  );

  return result;
};

const createRefreshToken = async (userId, token, expiresAt) => {
  const [rows] = await db.query(
    "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
    [userId, token, expiresAt],
  );

  return rows;
};

const getRefreshToken = async (token) => {
  const [rows] = await db.query(
    "SELECT id, user_id FROM refresh_tokens WHERE token = ? AND expires_at >= NOW()",
    [token],
  );

  return rows;
};

const deleteRefreshToken = async (id) => {
  const [rows] = await db.query("DELETE FROM refresh_tokens WHERE id = ?", [
    id,
  ]);

  return rows;
};

const changePassword = async (id, password) => {
  const [rows] = await db.execute(
    "UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?",
    [password, id],
  );

  return rows;
};

module.exports = {
  login,
  register,
  getUserById,
  logout,
  createRefreshToken,
  getRefreshToken,
  deleteRefreshToken,
  changePassword,
  getUserPasswordById,
};
