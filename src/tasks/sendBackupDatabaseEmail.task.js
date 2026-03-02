const mailService = require("@/services/mail.service");

async function sendBackupDatabaseEmail(payload) {
  await mailService.sendBackupDatabaseEmail(payload);
}

module.exports = sendBackupDatabaseEmail;