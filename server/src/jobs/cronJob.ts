import cron from "node-cron";
import { flagOldStatuses } from "../controller/project/projectController";
import { checkUptimeStatus } from "../controller/agent/performance";
import logger from "../lib/util/logger";

const flagOldStatusesJob = () => {
    try{
      cron.schedule("*/5 * * * * *", flagOldStatuses);
    }catch(error){
      logger.error(error);
      throw new Error("Error scheduling cron job");
    }
};

const startUptimeCron = () => {
  try {
    cron.schedule("*/3 * * * *", checkUptimeStatus);
  } catch (error) {
    logger.error("Error scheduling uptime cron job:", error);
    throw new Error("Error scheduling uptime cron job");
  }
};

export { flagOldStatusesJob, startUptimeCron };





