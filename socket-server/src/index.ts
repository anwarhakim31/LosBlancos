import express from "express";
import http from "http";
import { Server as Socket } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const origin = process.env.ORIGIN || "http://localhost:3000";
const mongo_url = process.env.DB_URL || "mongodb://localhost:27017/";

const app = express();

const server = http.createServer(app);

const io = new Socket(server, {
  cors: {
    origin,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const connectDB = async () => {
  try {
    await mongoose.connect(mongo_url as string);

    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};

// const User = mongoose.model("User", new mongoose.Schema({}));
// const Product = mongoose.model("Product", new mongoose.Schema({}));

io.on("connection", (socket) => {
  const userSocketMap = new Map();

  const userId = socket.handshake.query.userId;
  const role = socket.handshake.query.role;

  if (role !== "admin") userSocketMap.set(userId, socket.id);

  io.emit("onlineUsers", Array.from(userSocketMap.keys()));

  // io.emit("statistik");

  socket.on("disconnect", () => {
    userSocketMap.forEach((socketId, userId) => {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
      }
    });
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  connectDB();
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use("/", (req, res) => {
  res.send("Hello World!");
});
