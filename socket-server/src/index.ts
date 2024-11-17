import express, { Request, Response } from "express";
import http from "http";
import { Server as Socket } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const origin = process.env.ORIGIN || "http://localhost:3000";
const MONGO_URL = process.env.MONGODB_URL;
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
    mongoose.connect(MONGO_URL as string, {
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
const Products = mongoose.model("Product", new mongoose.Schema({}));
const Collection = mongoose.model(
  "Collection",
  new mongoose.Schema({
    name: String,
  })
);
const Notification = mongoose.model("Notification", new mongoose.Schema({}));

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
          $unwind: "$items",
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

const getBestSaller = async () => {
  const bestSaller = await Products.find().sort({ sold: -1 }).limit(3);
  return bestSaller;
};

const getBestCollection = async () => {
  const collection = await Collection.find();

  if (!collection) {
    return [];
  }

  const bestCollection = await Products.aggregate([
    {
      $match: {
        collectionName: { $in: collection.map((c) => c._id) },
      },
    },
    {
      $group: {
        _id: "$collectionName",
        total: { $sum: 1 },
      },
    },
    {
      $sort: { total: -1 },
    },
  ]);

  const chartData = collection.map((c, i) => ({
    collection: c.name,
    total:
      bestCollection.find((b) => b._id.toString() === c._id.toString())
        ?.total || 0,
    fill: getColor(i),
  }));

  return chartData;
};

const getRatingProduct = async () => {
  const ranges = [
    { id: 0, range: "0–0.5" },
    { id: 0.5, range: "0.5–1" },
    { id: 1, range: "1–1.5" },
    { id: 1.5, range: "1.5–2" },
    { id: 2, range: "2–2.5" },
    { id: 2.5, range: "2.5–3" },
    { id: 3, range: "3–3.5" },
    { id: 3.5, range: "3.5–4" },
    { id: 4, range: "4–4.5" },
    { id: 4.5, range: "4.5–5" },
  ];

  const rating = await Products.aggregate([
    {
      $bucket: {
        groupBy: "$averageRating",
        boundaries: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
        default: "Lainnya",
        output: {
          total: { $sum: 1 },
        },
      },
    },
    {
      $addFields: {
        range: {
          $switch: {
            branches: ranges.map(({ id, range }) => ({
              case: { $eq: ["$_id", id] },
              then: range,
            })),
            default: "Lainnya",
          },
        },
      },
    },
    {
      $project: { _id: 0, range: 1, total: 1 },
    },
  ]);

  const result = ranges.map(({ range }) => {
    const match = rating.find((r) => r.range === range);
    return { range, total: match ? match.total : 0 };
  });

  return result;
};

const userGrowth = async () => {
  const userGrowth = await User.aggregate([
    {
      $match: { role: "customer" },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        date: "$_id",
        count: 1,
        _id: 0,
      },
    },
    { $limit: 4 },
  ]);

  return userGrowth;
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
      bestSaller: await getBestSaller(),
      revenueData: await getRevenueData(),
      bestCollection: await getBestCollection(),
      ratingProduct: await getRatingProduct(),
      userGrowth: await userGrowth(),
    });
  } catch (error) {
    console.log(error);
  }
};

const notifMessage = async () => {
  try {
    const notif = await Notification.find({ read: false }).sort({
      createdAt: -1,
    });

    io.emit("notification", {
      message: notif,
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
  if (role === "admin") await notifMessage();

  socket.on("disconnect", () => {
    userSocketMap.forEach((socketId, userId) => {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
      }
    });
  });
});

app.use(express.json());

app.post("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.post("/api/notification", async (req: Request, res: Response) => {
  const statisticDB = await Statistic.findOne({});
  const totaUser = await User.countDocuments({ role: "customer" });
  const notif = await Notification.find({ read: false }).sort({
    createdAt: -1,
  });

  const { order_id } = req.body;

  io.emit("notification", {
    order_id,
    message: notif,
    statistic: {
      totalUser: totaUser || 0,
      totalIncome: statisticDB?.income || 0,
      totalProduct: statisticDB?.product || 0,
      totalTransaction: statisticDB?.transaction || 0,
      bestSaller: await getBestSaller(),
      revenueData: await getRevenueData(),
      bestCollection: await getBestCollection(),
    },
  });

  res.status(200).json({ message: "Order received" });
});

app.get("/api/notification", (req: Request, res: Response) => {
  res.status(200).json({ message: "true" });
});

server.listen(PORT, () => {
  connectDB();
  console.log(`Server running on http://localhost:${PORT}`);
});

const getColor = (index: number) => {
  switch (index) {
    case 0:
      return "#12a7e3"; // Light blue
    case 1:
      return "#FFEB3B"; // Light Yellow
    case 2:
      return "#8BC34A"; // Light Green
    case 3:
      return "#00BCD4"; // Light Cyan
    case 4:
      return "#FF9800"; // Light Orange
    case 5:
      return "#9C27B0"; // Light Purple
    case 6:
      return "#FF5722"; // Light Red-Orange
    case 7:
      return "#00FF7F"; // Light Spring Green
    default:
      return "#000000"; // Default black
  }
};
