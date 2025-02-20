import mongoose, { Schema, InferSchemaType } from "mongoose";

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true });

type UserType = InferSchemaType<typeof UserSchema>;
const User = model("User", UserSchema);
export { User, UserType };
