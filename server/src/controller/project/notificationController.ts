import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../lib/types/type";
import Notification from "../../model/notiModel";

export const getNotifications = async (req: AuthenticatedRequest, res: Response) => {
    const { projectId } = req.params;
    const notifications = await Notification.find({ project: projectId }).sort({ createdAt: -1 }).limit(25);
    res.status(200).json(notifications);
};


export const markAsRead = async (req: AuthenticatedRequest, res: Response) => {
    const { projectId } = req.params;

    await Notification.updateMany(
        { project: projectId, status: "unread" },
        { $set: { status: "read" } }
    );

    res.status(200).json({ message: "Notifications marked as read" });
};
