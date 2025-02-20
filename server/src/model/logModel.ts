import { log } from "console";
import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const logSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: [String], // Array of strings
    enum: ["serverlog", "userlog"], // Only these values are allowed
    required: true,
  },
  project:{
    type:Schema.Types.ObjectId,
    ref:"Project",
    required:true,
},  
},{ timestamps: true });

type LogType = InferSchemaType<typeof logSchema>;

const Log:Model<LogType>=mongoose.model("Log", logSchema);
export default Log 