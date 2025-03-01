import { Schema, InferSchemaType, Model, model } from "mongoose";

const securitySchema = new Schema(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true, 
    },
    statusCode: {
      type: Number,
      required: true,
    },
    isSuccess: {
      type: Boolean,
      required: true,
    },
    ip: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    duration: {
      type: Number, 
    },
  },
  { timestamps: true }
);

type ISecurity = InferSchemaType<typeof securitySchema>;

const Security: Model<ISecurity> = model<ISecurity>("Security", securitySchema);
export default Security;
