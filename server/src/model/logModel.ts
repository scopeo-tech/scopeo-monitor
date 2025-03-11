import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const logSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  statusCode: {
    type: Number,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  route: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
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