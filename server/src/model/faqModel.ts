import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const faqSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
      unique: true,
    },
    answer: {
      type: String,
      required: true,
    },
    keywords: {
      type: [String],
      required: true,
    },
    searchCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

type IFaq = InferSchemaType<typeof faqSchema>;

const Faq: Model<IFaq> = mongoose.model("Faq", faqSchema);
export default Faq;
