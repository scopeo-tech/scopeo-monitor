import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const logSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: [String], 
    enum: ["serverlog", "userlog"],
    required: true,
  },
  project:{
    type:Schema.Types.ObjectId,
    ref:"Project",
    required:true,
},  
},{ timestamps: true });

type ILog = InferSchemaType<typeof logSchema>;

const Log:Model<ILog>=mongoose.model("Log", logSchema);
export default Log 