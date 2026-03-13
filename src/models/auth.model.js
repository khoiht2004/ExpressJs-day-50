const prisma = require("@/utils/prisma");

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
  const user = await prisma.users.findUnique({
    where: { id },
    select: { password: true },
  });
  if (!user) return null;
  return user.password;
};

const logout = async (token, expiresAt) => {
  const result = await prisma.revoked_tokens.create({
    data: {
      token,
      expires_at: new Date(expiresAt),
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  return result;
};

const createRefreshToken = async (userId, token, expiresAt) => {
  const result = await prisma.refresh_tokens.create({
    data: {
      user_id: userId,
      token,
      expires_at: new Date(expiresAt),
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  return result;
};

const getRefreshToken = async (token) => {
  const rows = await prisma.refresh_tokens.findMany({
    where: {
      token,
      expires_at: {
        gte: new Date(),
      },
    },
    select: {
      id: true,
      user_id: true,
    },
  });

  return rows;
};

const changePassword = async (id, password) => {
  const result = await prisma.users.update({
    where: { id },
    data: {
      password,
      updated_at: new Date(),
    },
  });

  return result;
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
