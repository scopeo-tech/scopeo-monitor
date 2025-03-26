import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { Notification } from "../interface";

interface NotificationStore {
  notifications: Notification[];
  socket: Socket | null;
  initializeSocket: (userId: string, token: string) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  socket: null,

  initializeSocket: (userId, token) => {
    if (get().socket) return;

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
      auth: { pass: token },
    });

    socket.emit("join");

    socket.on("notification", (newNotification: Notification) => {
      set((state) => ({
        notifications: [newNotification, ...state.notifications],
      }));
    });

    set({ socket });
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },
}));
