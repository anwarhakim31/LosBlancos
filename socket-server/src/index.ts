import express from "express";
import http from "http";
import { Server as Socket } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const origin = process.env.ORIGIN || "http://localhost:3000";
const mongo_url = process.env.DB_URL;
const PORT = process.env.PORT || 4000;

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
    mongoose.connect(mongo_url as string, {
      dbName: "LosBlancos",
    });

    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
};

const User = mongoose.model("User", new mongoose.Schema({}));

const Statistic = mongoose.model(
  "Statistic",
  new mongoose.Schema({
    income: Number,
    product: Number,
    transaction: Number,
  })
);

const Transaction = mongoose.model("Transaction", new mongoose.Schema({}));

const getRevenueData = async () => {
  const now = new Date();
  const startYear = now.getFullYear();
  const monthInterval = 1;
  const revenueData = [];

  for (let year = startYear; year <= now.getFullYear(); year++) {
    for (let month = 0; month < 12; month += monthInterval) {
      const firstDayOfMonth = new Date(year, month, 1);
      const lastDayOfMonth = new Date(year, month + monthInterval, 0);

      const aggregate = [
        {
          $match: {
            paymentStatus: "dibayar",
            transactionDate: { $gte: firstDayOfMonth, $lt: lastDayOfMonth },
          },
        },
        {
          $group: {
            _id: null,
            totalIncome: {
              $sum: {
                $add: ["$subtotal", 1000, { $subtract: ["$diskon", 0] }],
              },
            },
            totalTransaction: {
              $sum: 1,
            },
          },
        },
        {
          $unwind: "$items",
        },
        {
          $group: {
            _id: null,
            totalIncome: {
              $sum: "$items.price",
            },
            totalTransaction: {
              $sum: 1,
            },
            totalProduct: {
              $sum: "$items.quantity",
            },
          },
        },
      ];

      const totalRevenue = await Transaction.aggregate(aggregate);

      revenueData.push({
        month: `${year}-${String(month + 1).padStart(2, "0")}`,
        transaction: totalRevenue[0]?.totalTransaction || 0,
        income: totalRevenue[0]?.totalIncome || 0,
        product: totalRevenue[0]?.totalProduct || 0,
      });
    }
  }

  return revenueData;
};

const statistik = async () => {
  try {
    const totaUser = await User.countDocuments({ role: "customer" });
    const statisticDB = await Statistic.findOne({});

    io.emit("statistik", {
      totalUser: totaUser || 0,
      totalIncome: statisticDB?.income || 0,
      totalProduct: statisticDB?.product || 0,
      totalTransaction: statisticDB?.transaction || 0,

      revenueData: await getRevenueData(),
    });
  } catch (error) {
    console.log(error);
  }
};

const userSocketMap = new Map();

io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId;
  const role = socket.handshake.query.role;

  if (role !== "admin") userSocketMap.set(userId, socket.id);

  io.emit("onlineUsers", Array.from(userSocketMap.keys()));

  if (role === "admin") await statistik();

  socket.on("disconnect", () => {
    userSocketMap.forEach((socketId, userId) => {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
      }
    });
  });
});

server.listen(PORT, () => {
  connectDB();
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use("/", (req, res) => {
  res.send("Hello World!");
});
