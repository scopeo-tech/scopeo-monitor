import mongoose from "mongoose";
import logger from "../lib/util/logger";

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI as string);
    logger.info("Connected to Database");
  } catch (error) {
    logger.error("Failed to connect to the Database, ", error);
  }
};

export default dbConnect;