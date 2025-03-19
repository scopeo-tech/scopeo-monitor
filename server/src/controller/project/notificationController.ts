import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../lib/types/type";
import Notification from "../../model/notiModel";

/**
 * Get notifications by userId and projectId
 */
export const getNotifications = async (req: AuthenticatedRequest, res: Response) => {
    const { projectId } = req.params;
    const userId = req.user;

    console.log(projectId)
    const notifications = await Notification.find({ project: projectId }).sort({ createdAt: -1 }).limit(25);
    console.log(notifications)

    res.status(200).json(notifications);
};

/**
 * Mark notifications as read by userId and projectId
 */
export const markAsRead = async (req: AuthenticatedRequest, res: Response) => {
    const { projectId } = req.params;
    const userId = req.user;

    await Notification.updateMany(
        { user: userId, project: projectId, status: "unread" },
        { $set: { status: "read" } }
    );

    res.status(200).json({ message: "Notifications marked as read" });
};
