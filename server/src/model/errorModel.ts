import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const errorSchema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
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
    message: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

type IError = InferSchemaType<typeof errorSchema>;

const Error: Model<IError> = mongoose.model("Error", errorSchema);
export default Error;