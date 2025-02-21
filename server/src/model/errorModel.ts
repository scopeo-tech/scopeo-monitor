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

type IError = InferSchemaType<typeof errorSchema>;

const Error: Model<IError>=mongoose.model("Error", errorSchema);
 export default Error