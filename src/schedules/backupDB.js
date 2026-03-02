const driveService = require("@/services/drive.service");
const queueService = require("@/services/queue.service");
const { mailConfig } = require("@/config");
async function backupDB() {
  try {
    // Backup DB
    await driveService.backupDB();

    // Copy to Drive
    await driveService.uploadToDrive();

    // Send email
    await queueService.push("sendBackupDatabaseEmail", {
      email: mailConfig.fromAddress,
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = backupDB;
