import { set } from "mongoose";
import { flagOldStatuses } from "../controller/project/projectController";


const startFlaggingOldStatusesCronJob = async (): Promise<void> => {
  setInterval(async () => {
    try {
        await flagOldStatuses();
    } catch (error) {
      console.error(error);
    }
  }, 5000);
};


export default startFlaggingOldStatusesCronJob;