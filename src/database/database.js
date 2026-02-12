const mysql = require("mysql2/promise");
const { database } = require("@/config");

const db = mysql.createPool({
  host: database.host,
  user: database.user,
  password: database.password,
  database: database.database,
  port: database.port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = db;
