import cron from "node-cron";
import { flagOldStatuses } from "../controller/project/projectController";

const flagOldStatusesJob = () => {
    try{
      cron.schedule("*/5 * * * * *", flagOldStatuses);
    }catch(error){
      console.log(error);
      throw new Error("Error scheduling cron job");
    }
};

export default flagOldStatusesJob

