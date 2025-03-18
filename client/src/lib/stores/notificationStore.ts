import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { Notification } from "../interface";

interface NotificationStore {
  notifications: Notification[];
  socket: Socket | null;
  initializeSocket: (userId: string, token: string) => void;
  markAsRead: (id: string) => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  socket: null,

  // Initialize socket connection
  initializeSocket: (userId, token) => {
    if (get().socket) return; // Prevent multiple connections

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
      auth: { pass: token },
    });

    // Join the user's room
    socket.emit("join");

    // Listen for new notifications
    socket.on("notification", (newNotification: Notification) => {
      set((state) => ({
        notifications: [newNotification, ...state.notifications], // Prepend new notifications
      }));
    });

    set({ socket });
  },

  // Mark a notification as read
  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((noti) =>
        noti._id === id ? { ...noti, status: "read" } : noti
      ),
    }));
  },
}));