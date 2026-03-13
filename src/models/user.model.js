const prisma = require("@/utils/prisma");

async function searchUserByEmail(currentUserEmail, q) {
  const users = await prisma.users.findMany({
    where: {
      email: { contains: q },
      NOT: { email: currentUserEmail },
    },
    select: { id: true, email: true },
  });
  return users;
}

module.exports = { searchUserByEmail };
