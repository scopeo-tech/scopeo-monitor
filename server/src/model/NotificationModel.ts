import mongoose,{InferSchemaType, Schema, model} from "mongoose";

const notificationSchema = new Schema({
    message:{
        type:String,
        required:true,
    },
   
    project:{
        type:Schema.Types.ObjectId,
        ref:"Project",
        required:true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
},
    { timestamps: true });

type INotification = InferSchemaType<typeof notificationSchema>;

const Notification = model<INotification>("Notification",notificationSchema);
export default Notification;