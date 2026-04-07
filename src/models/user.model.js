const prisma = require("@/libs/prisma");

async function searchUserByEmail(currentUserEmail, q) {
  const users = await prisma.user.findMany({
    where: {
      email: { contains: q },
      NOT: { email: currentUserEmail },
    },
    select: { id: true, email: true },
  });
  return users;
}

module.exports = { searchUserByEmail };
