import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const healthSchema = new Schema({
  uptime: {
    type: Number,
    required: true,
  },
  responseTime: {
    type: Number,
    required: true,
  },
  apiLatency: {
    type: Number,
    required: true,
  },
  project:{
    type:Schema.Types.ObjectId,
    ref:"Project",
    required:true,
},  
},{ timestamps: true });

type HealthType = InferSchemaType<typeof healthSchema>;

 const Health:Model<HealthType>=mongoose.model("Health", healthSchema);
 export default Health