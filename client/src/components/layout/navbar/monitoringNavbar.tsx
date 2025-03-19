"use client";

import React, { useEffect, useState } from "react";
import { FiBell } from "react-icons/fi";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProjectById, markAsRead } from "@/lib/api";
import { Project } from "@/lib/interface";
import { useNotificationStore } from "@/lib/stores/notificationStore";
import { useAuthStore } from "@/lib/stores/authStore";
import NotificationModal from "@/components/modal/notification"; // Import the modal

const MonitoringNavbar = () => {
  const { notifications, initializeSocket, clearNotifications } = useNotificationStore();
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem("token");
  const { user } = useAuthStore();
  const { projectID } = useParams<{ projectID: string }>();

  const { data: project } = useQuery<Project>({
    queryKey: ["project", projectID],
    queryFn: () => getProjectById(projectID),
  });

  useEffect(() => {
    if (user && token) {
      initializeSocket(user._id, token);
    }
  }, [user, token, initializeSocket]);

  const toggleModal = async () => {
    setIsOpen((prev) => !prev);

    try {
      if (isOpen) return; // Prevent duplicate API calls when closing

      if (projectID) {
        await markAsRead(projectID);
      }

      clearNotifications();
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  // Filter notifications only for the current project
  const projectNotifications = notifications.filter((n) => n.project === projectID);

  return (
    <nav className="fixed top-0 left-64 w-[calc(87%-36px)] bg-white shadow-md flex items-center justify-between px-10 py-3">
      <div className="flex items-center">
        <span className="text-gray-600 text-lg font-semibold">{project?.name}</span>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={toggleModal} className="text-gray-500 hover:text-gray-700 relative">
          <FiBell />
          {projectNotifications.length > 0 && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>
        <div className="w-8 h-8 bg-rose-500 text-white flex items-center justify-center rounded-full text-lg">
          {user?.username[0].toUpperCase()}
        </div>
      </div>

      {/* Render the Notification Modal */}
      {isOpen && <NotificationModal onClose={toggleModal} />}
    </nav>
  );
};

export default MonitoringNavbar;
