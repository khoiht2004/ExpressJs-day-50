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

async function searchUserByName(currentUserEmail, q) {
  const users = await prisma.users.findMany({
    where: {
      user_name: { contains: q },
      NOT: { email: currentUserEmail },
    },
    select: { id: true, email: true, user_name: true },
  });
  return users;
}

module.exports = { searchUserByEmail, searchUserByName };
