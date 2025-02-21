import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const faqSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
}, { timestamps: true });

type IFAQ = InferSchemaType<typeof faqSchema>;

 const FAQ:Model<IFAQ>=mongoose.model("FAQ", faqSchema);
 export default FAQ