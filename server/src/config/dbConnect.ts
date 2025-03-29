import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI as string);
    console.log("Connected to Database");
  } catch (error) {
    console.error("Failed to connect to the Database, ", error);
  }
};

export default dbConnect;