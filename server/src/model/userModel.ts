import mongoose, { Schema, InferSchemaType ,Model} from "mongoose";

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true });


type IUser = InferSchemaType<typeof UserSchema>;

const User: Model<IUser> = mongoose.model("User", UserSchema);

export default User;