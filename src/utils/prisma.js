// const { PrismaClient } = require("../../generated/prisma");
// const { PrismaPg } = require("@prisma/adapter-pg");
// const adapter = new PrismaPg(process.env.DATABASE_URL);
// const prisma = new PrismaClient({ adapter });
// module.exports = prisma;

const { PrismaClient } = require("../../generated/prisma");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const { databaseConfig } = require("@/config");

const adapter = new PrismaMariaDb({
  host: databaseConfig.host,
  user: databaseConfig.user,
  password: databaseConfig.password,
  database: databaseConfig.database,
  port: databaseConfig.port,
});

const prisma = new PrismaClient({ adapter });

module.exports = prisma;
