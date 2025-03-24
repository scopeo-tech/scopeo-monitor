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
    return next(new Error("No socket token!"));
  }

  try {
    const decoded = jwt.verify(pass, process.env.JWT_TOKEN as string);
    socket.handshake.auth.userId = (decoded as { id: string }).id;
    socket.data.userId = (decoded as { id: string }).id;
  } catch (error) {
    console.log("socket pass decode error", error);
    return next(new Error("Invalid socket token!"));
  }

  next();
});

io.on("connection", async (socket) => {

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });

  
  socket.on("join", () => {
    userSocketMap[socket.data.userId] = socket.id;
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
  });
});