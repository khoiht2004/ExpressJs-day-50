require("dotenv").config();
require("module-alias/register");

const queueService = require("@/services/queue.service");
const jobs = require("@/jobs");
const sleep = require("@/utils/sleep");

(async () => {
  while (true) {
    const pendingJobs = await queueService.getPendingJobs();
    if (pendingJobs) {
      const { id, type, payload: jsonPayload } = pendingJobs;
      try {
        const payload = JSON.parse(jsonPayload);

        queueService.updateStatus(id, "in_progress");
        const handle = jobs[type];
        if (handle) {
          await handle(payload);
        } else {
          console.log("Job invalid");
        }

        queueService.updateStatus(id, "completed");
      } catch (error) {
        queueService.updateStatus(id, "failed");
        console.log(error);
      }
    }
    await sleep(3000);
  }
})();
