const prisma = require("@/libs/prisma");

async function cleanupExpiredTokens() {
  const result = await prisma.revoked_tokens.deleteMany({
    where: {
      expires_at: { lt: new Date() },
    },
  });

  console.log(`Cleanup ${result.count} expired tokens`);
}

module.exports = cleanupExpiredTokens;
