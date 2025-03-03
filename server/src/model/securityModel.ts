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
      required: true,
    },
    userAgent: {
      type: String,
    },
    duration: {
      type: Number,
    },
    isBruteForce: {
      type: Boolean,
      default: false,
    },
    isUnusual: {
      type: Boolean,
      default: false, 
    },
    unusualReason: {
      type: String, 
      enum: [
        "Rapid consecutive login failures followed by success",
        "Unusually high number of logins within 24 hours",
      ],
      default: null,
    },
  },
  { timestamps: true }
);

type ISecurity = InferSchemaType<typeof securitySchema>;

const Security: Model<ISecurity> = model<ISecurity>("Security", securitySchema);
export default Security;
