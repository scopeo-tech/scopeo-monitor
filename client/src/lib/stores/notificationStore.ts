import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { Notification } from "../interface";

interface NotificationState {
  notifications: Notification[];
  socket: Socket | null;
  setNotifications: (notifications: Notification[]) => void;
  connectSocket: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => {
  let socket: Socket | null = null;

  return {
    notifications: [],
    socket: null,

    setNotifications: (notifications) => set({ notifications }),

    connectSocket: () => {
      if (!socket) {
        socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
          transports: ["websocket"],
        });

        socket.on("connect", () => {
          console.log("Connected to Socket.IO");
          set({ socket });
        });

        socket.on("new_notification", (notification: Notification) => {
          set((state) => ({
            notifications: [notification, ...state.notifications],
          }));
        });

        socket.on("disconnect", () => {
          console.log("Disconnected from Socket.IO");
          set({ socket: null });
        });
      }
    },
  };
});
