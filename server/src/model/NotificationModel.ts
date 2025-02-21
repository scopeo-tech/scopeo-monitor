import mongoose ,{Schema,InferSchemaType ,Model} from "mongoose";

const notificationSchema = new Schema({
        message: {
            type: String,
            required: true,
        },
        reciever: {
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        project:{
                type:Schema.Types.ObjectId,
                ref:"Project",
                required:true,
        },  
    },{ timestamps: true }
);

type INotification = InferSchemaType<typeof notificationSchema>;
const Notification:Model<INotification> = mongoose.model("Notification",notificationSchema);    

export default Notification
