import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const errorSchema = new Schema({
    type: {
      type: [String], 
      enum: ["404", "400", "500", "auth"], 
      required: true,
    },
    project:{
        type:Schema.Types.ObjectId,
        ref:"Project",
        required:true,
    },  
  },{ timestamps: true }
);

type ErrorType = InferSchemaType<typeof errorSchema>;

const Error: Model<ErrorType>=mongoose.model("Error", errorSchema);
export default Error