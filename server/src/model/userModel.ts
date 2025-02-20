import mongoose, {Schema,Document} from "mongoose";

interface UserType extends Document{
    username:string;
    email:string;
    password:string;
}

const UserSchema = new Schema<UserType>({
    username:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true}
},
        { timestamps: true }
)

const User = mongoose.model<UserType>("User", UserSchema);
export { User, UserType };