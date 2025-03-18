import { Server } from "socket.io";
import { Server as HTTPServer } from "http";

const onlineUsers = new Map<string, string>(); 

export const initializeSocket = (server: HTTPServer) => {
  const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL, credentials: true },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("registerUser", (userId: string) => {
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    socket.on("disconnect", () => {
      const userId = [...onlineUsers.entries()].find(([_, id]) => id === socket.id)?.[0];
      if (userId) {
        onlineUsers.delete(userId);
      }
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export const sendNotification = (io: Server, userId: string, notification: any) => {
  const socketId = onlineUsers.get(userId);
  if (socketId) {
    io.to(socketId).emit("newNotification", notification);
  }
};
