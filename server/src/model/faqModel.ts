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

type FAQType = InferSchemaType<typeof faqSchema>;

 const FAQ:Model<FAQType>=mongoose.model("FAQ", faqSchema);
 export default FAQ