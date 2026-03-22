const prisma = require("@/utils/prisma");

const isRevoked = async (token) => {
  const count = await prisma.revoked_tokens.count({
    where: { token },
  });
  return count > 0 ? 1 : 0;
};

module.exports = { isRevoked };
