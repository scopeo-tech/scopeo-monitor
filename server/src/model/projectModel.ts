import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const projectSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    apiKey: { type: String, required: true, unique: true },
    passKey: { type: String, required: true, unique: true },
    status: {connectionStatus: { type: Boolean, default: false },updatedAt: { type: Date, default: Date.now }},
    notificationStatus: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type IProject = InferSchemaType<typeof projectSchema>;
const Project: Model<IProject> = mongoose.model("Project", projectSchema);

export default Project;