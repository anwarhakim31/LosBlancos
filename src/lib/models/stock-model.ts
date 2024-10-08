import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  attribute: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Stock = mongoose.models.Stock || mongoose.model("Stock", stockSchema);

export default Stock;
