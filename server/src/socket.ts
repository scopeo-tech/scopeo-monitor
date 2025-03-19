import { createServer } from "node:http";
import { Server } from "socket.io";
import Notification from "./model/notiModel";
import { INotification } from "./model/notiModel";
import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ILog } from "./model/logModel";

dotenv.config();

interface UserSocketMap {
  [userId: string]: string;
}

export const userSocketMap: UserSocketMap = {}; 
console.log(process.env.CLIENT_URL);
export const app = express();
export const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

io.use((socket, next) => {
  const pass = socket.handshake.auth.pass;
  if (!pass) {
    console.log("no token");
    return next(new Error("No socket token!"));
  }

  try {
    const decoded = jwt.verify(pass, process.env.JWT_TOKEN as string);
    socket.handshake.auth.userId = (decoded as { id: string }).id;
    socket.data.userId = (decoded as { id: string }).id;
    console.log("decoded", decoded);
  } catch (error) {
    console.log("socket pass decode error", error);
    return next(new Error("Invalid socket token!"));
  }

  next();
});

io.on("connection", async (socket) => {
  console.log("a user connected", socket.id);

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });

  
  socket.on("join", () => {
    console.log("user joined", socket.data.userId);
    userSocketMap[socket.data.userId] = socket.id;
    console.log("user joined", socket.data.userId);
    console.log(userSocketMap);
  });

  
  socket.on(
    "notification",
    async (notification : INotification) => {
      const receiverSocketId = userSocketMap[notification.user.toString() as string];

      
      try {
        
        if (receiverSocketId) {
          socket.to(receiverSocketId).emit("notification", notification);
        }
      } catch (error) {
        console.log("Error creating notification:", error);
        console.log("Notification data:", notification);
      }
    }
  );

  
socket.on(
  "logs",
  async (logData: ILog,userId:string) => {
    try {
      const receiverSocketId = userSocketMap[userId];
      
      if (receiverSocketId) {
        
        socket.to(receiverSocketId).emit("logs", logData);
      }
      
      
      console.log("Log event received:", {
       ...logData,
      });
      
    } catch (error) {
      console.log("Error processing security event:", error);
      console.log("Security data:", logData);
    }
  }
);

  socket.on("disconnect", () => {
    const disconnectedUser = Object.keys(userSocketMap).find(
      (key) => userSocketMap[key] === socket.id
    );
    if (disconnectedUser) {
      delete userSocketMap[disconnectedUser];
    }
    console.log("A user disconnected:", socket.id);
    console.log(userSocketMap);
  });
});