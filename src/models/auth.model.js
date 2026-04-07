const prisma = require("@/libs/prisma");

const register = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      emailVerifiedAt: true,
    },
  });

  if (user) return null;

  const newUser = await prisma.user.create({
    data: {
      email,
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    select: {
      id: true,
      email: true,
      password: true,
      emailVerifiedAt: true,
    },
  });

  return newUser;
};

const login = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      emailVerifiedAt: true,
    },
  });
  return user;
};

const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
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
  const user = await prisma.user.findUnique({
    where: { id },
    select: { password: true },
  });
  if (!user) return null;
  return user.password;
};

const logout = async (token, expiresAt) => {
  const result = await prisma.revokedToken.create({
    data: {
      token,
      expiresAt: new Date(expiresAt),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return result;
};

const createRefreshToken = async (userId, token, expiresAt) => {
  const result = await prisma.refreshToken.create({
    data: {
      userId,
      token,
      expiresAt: new Date(expiresAt),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return result;
};

const getRefreshToken = async (token) => {
  const rows = await prisma.refreshToken.findMany({
    where: {
      token,
      expiresAt: {
        gte: new Date(),
      },
    },
    select: {
      id: true,
      userId: true,
    },
  });

  return rows;
};

const changePassword = async (id, password) => {
  const result = await prisma.user.update({
    where: { id },
    data: {
      password,
      updatedAt: new Date(),
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
