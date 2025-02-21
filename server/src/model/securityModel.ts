import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const securitySchema = new Schema({
    type: {
      type: [String], 
      enum: ["total", "failed", "unusual", "apiabuse"], 
      required: true,
    },
    project:{
        type:Schema.Types.ObjectId,
        ref:"Project",
        required:true,
    },  
  },{ timestamps: true });

  type ISecurity = InferSchemaType<typeof securitySchema>;

 const Security: Model<ISecurity> = mongoose.model("Security", securitySchema);
 export default Security