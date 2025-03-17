import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { Notification } from "../interface";

interface NotificationState {
  notifications: Notification[];
  socket: Socket | null;
  setNotifications: (notifications: Notification[]) => void;
  connectSocket: () => void;
  registerUser: (userId: string) => void;
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
          
          // Re-register user ID if available
          const userId = localStorage.getItem("userId");
          if (userId) {
            socket?.emit("registerUser", userId);
          }
        });

        socket.on("newNotification", (notification: Notification) => {
          console.log("Received notification:", notification);
          set((state) => ({
            notifications: [notification, ...state.notifications],
          }));
        });

        socket.on("disconnect", () => {
          console.log("Disconnected from Socket.IO");
        });

        socket.on("connect_error", (error) => {
          console.error("Socket connection error:", error);
        });
      }
    },

    registerUser: (userId: string) => {
      if (socket) {
        socket.emit("registerUser", userId);
        console.log("Registered user with socket:", userId);
        localStorage.setItem("userId", userId);
      } else {
        console.error("Socket not connected. Cannot register user.");
      }
    },
  };
});
