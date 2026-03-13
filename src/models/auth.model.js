const db = require("@/database/database");
const prisma = require("@/utils/prisma");
const { emit } = require("process");

const register = async (email, password) => {
  const user = await prisma.users.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      email_verified_at: true,
    },
  });

  if (user) return null;

  const newUser = await prisma.users.create({
    data: {
      email,
      password,
      created_at: new Date(),
      updated_at: new Date(),
    },
    select: {
      id: true,
      email: true,
      password: true,
      email_verified_at: true,
    },
  });

  return newUser;
};

const login = async (email) => {
  const user = await prisma.users.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      email_verified_at: true,
    },
  });
  return user;
};

const getUserById = async (id) => {
  const user = await prisma.users.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
    },
  });

  if (!user) return null;

  return user;
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
  changePassword,
  getUserPasswordById,
};
