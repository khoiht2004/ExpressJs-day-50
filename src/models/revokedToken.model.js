const prisma = require("@/libs/prisma");

const isRevoked = async (token) => {
  const count = await prisma.revokedToken.count({
    where: { token },
  });
  return count > 0 ? 1 : 0;
};

module.exports = { isRevoked };
