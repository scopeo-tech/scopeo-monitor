import mongoose,{InferSchemaType, Schema, Model} from "mongoose";

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

const Notification = Model<INotification>("Notification",notificationSchema);
export default Notification;
