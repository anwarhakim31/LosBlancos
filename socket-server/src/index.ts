import express from "express";
import http from "http";
import socketIo from "socket.io";

const app = express();

const server = http.createServer(app);

const io = new socketIo.Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userSocketMap = new Map();

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  const role = socket.handshake.query.role;

  if (role !== "admin") userSocketMap.set(userId, socket.id);

  io.emit("onlineUsers", Array.from(userSocketMap.keys()));

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
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use("/", (req, res) => {
  res.send("Hello World!");
});
