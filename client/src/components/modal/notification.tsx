"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation"; // Get projectID from URL
import { getNotification } from "@/lib/api";
import { Notification } from "@/lib/interface";
import { X } from "lucide-react";
import { format } from "date-fns"; // Import date-fns
import { useNotificationStore } from "@/lib/stores/notificationStore";

interface NotificationModalProps {
  onClose: () => void;
}

const severityColors: Record<Notification["severity"], string> = {
  info: "bg-blue-500",
  warning: "bg-yellow-500",
  critical: "bg-red-500",
};

const NotificationModal: React.FC<NotificationModalProps> = ({ onClose }) => {
  const { projectID } = useParams(); // Get projectID from URL
  const { notifications } = useNotificationStore();
  const [allNotifications, setAllNotifications] = useState<Notification[]>([])

  const { data: dbNotification = [], isLoading } = useQuery({
    queryKey: ["dbNotification", projectID],
    queryFn: () => getNotification(projectID as string),
    enabled: !!projectID, // Only run when projectID is available
  });
  
  // Merge notification
  useEffect(() => {
    const projectNotifications = notifications.filter((n) => n.project === projectID);
    setAllNotifications([ ...dbNotification,...projectNotifications]);
  },[notifications, dbNotification, projectID]);


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg max-w-lg w-full">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2 mb-3">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {isLoading ? (
            <p className="text-gray-400 text-center">Loading notifications...</p>
          ) : allNotifications.length === 0 ? (
            <p className="text-gray-400 text-center">No notifications</p>
          ) : (
            allNotifications.map((notification: Notification) => (
              <div key={notification._id} className="flex items-center gap-3 p-3 border rounded-lg shadow-sm">
                <span className={`w-3 h-3 rounded-full ${severityColors[notification.severity]}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{notification.message}</p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(notification.createdAt), "MMM d, yyyy, h:mm a")}
                  </p>
                  <span className="text-xs text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">
                    {notification.type.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
