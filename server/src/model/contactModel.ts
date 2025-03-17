import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const contactSchema = new Schema({
    firstname: {
      type: String,
      required: true
    },
    lastname:{
       type: String, 
       required: true
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
}, { timestamps: true });

type IContact = InferSchemaType<typeof contactSchema>;
const Contact: Model<IContact> = mongoose.model("contact", contactSchema);
export default Contact;