    import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

    const notificationSchema = new Schema(
    {
        message: {
        type: String,
        required: true,
        },
        user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        },
        project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true,
        },
        type: {
        type: String,
        enum: ["brute_force", "unusual_login", "high_cpu", "high_memory", "high_disk"],
        required: true,
        },
        severity: {
        type: String,
        enum: ["info", "warning", "critical"],
        required: true,
        },
        metadata: {
        type: Object,
        required: true,
        },
        status: {
        type: String,
        enum: ["unread", "read"],
        default: "unread",
        },
    },
    { timestamps: true }
    );

    export type INotification = InferSchemaType<typeof notificationSchema>;

    const Notification: Model<INotification> = mongoose.model<INotification>(
    "Notification",
    notificationSchema
    );

    export default Notification;
