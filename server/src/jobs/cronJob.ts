import cron from "node-cron";
import { flagOldStatuses } from "../controller/project/projectController";

let isRunning = false;

const startFlaggingOldStatusesCronJob = async (): Promise<void> => {
  cron.schedule("*/5 * * * *", async () => {
    if(isRunning) {
      console.log("Job is already running");
      return;
    }
    isRunning = true;
    try {
      await flagOldStatuses();
    } catch (error) {
      console.error(error);
    }finally {
      isRunning = false;
    }
  })
};

export default startFlaggingOldStatusesCronJob;
