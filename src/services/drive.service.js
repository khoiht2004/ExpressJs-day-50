const { exec: childExec } = require("child_process");
const { promisify } = require("node:util");
const { databaseConfig } = require("@/config");
const { getDateStringYmdHis } = require("@/utils/helper");

const exec = promisify(childExec);

class DriveService {
  async backupDB() {
    const { host, port, user, password, database } = databaseConfig;
    const { backupLocalDir } = databaseConfig;
    const dateString = getDateStringYmdHis();
    const dumpCmd = `mysqldump -u${user} -h${host} -P${port} -p${password} ${database} > ${backupLocalDir}/${database}_${dateString}.sql`;

    await exec(dumpCmd);
    console.log("Backup DB successfully!");
    return { localDir: backupLocalDir, dateString };
  }

  async uploadToDrive() {
    const { backupLocalDir, backupRemote, backupRemoteDir } = databaseConfig;
    const copyCmd = `rclone copy ${backupLocalDir} ${backupRemote}:${backupRemoteDir}`;

    await exec(copyCmd);
    console.log("Upload to Google Drive successfully!");
  }
}

module.exports = new DriveService();
