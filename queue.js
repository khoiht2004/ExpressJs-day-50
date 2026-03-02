require("dotenv").config();
require("module-alias/register");

const queueService = require("@/services/queue.service");
const tasks = require("@/tasks");
const sleep = require("@/utils/sleep");

(async () => {
  while (true) {
    const pendingJobs = await queueService.getPendingJobs();
    if (pendingJobs) {
      const { id, type, payload: jsonPayload } = pendingJobs;
      try {
        const payload = JSON.parse(jsonPayload);

        queueService.updateStatus(id, "in_progress");
        const handle = tasks[type];
        // log
        console.log(`Job ${type} is processing`);
        if (handle) {
          await handle(payload);
        } else {
          console.log(`Job ${type} is invalid`);
        }

        queueService.updateStatus(id, "completed");
        // log
        console.log(`Job ${type} is completed at ${new Date().toISOString()}`);
      } catch (error) {
        queueService.updateStatus(id, "failed");
        // log
        console.log(`Job ${type} is failed at ${new Date().toISOString()}`);
        console.log(error);
      }
    }
    await sleep(3000);
  }
})();
