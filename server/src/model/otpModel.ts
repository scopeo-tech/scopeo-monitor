import mongoose, { Model, Schema, InferSchemaType } from "mongoose";

const otpSchema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  verified: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true },
});

type OtpType = InferSchemaType<typeof otpSchema>;

 const Otp:Model<OtpType>=mongoose.model("Otp", otpSchema);
 
 export default Otp;