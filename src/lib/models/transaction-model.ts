import mongoose from "mongoose";

const transactionItemModel = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  atribute: {
    type: String,
    required: true,
  },
  atributeValue: {
    type: String,
    required: true,
  },
});

const transactionSchema = new mongoose.Schema({
  invoice: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [transactionItemModel],
  subtotal: {
    type: Number,
    required: true,
    default: 0,
  },
  shippingCost: {
    type: Number,
    required: true,
    default: 0,
  },
  totalPayment: {
    type: Number,
    required: true,
    default: 0,
  },
  paymentMethod: {
    type: String,
    enum: ["credit_card", "bank_transfer", "paypal", "cash_on_delivery"],
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ["pending", "paid", "failed", "cancelled"],
    default: "pending",
  },
  transactionStatus: {
    type: String,
    required: true,
    enum: ["pending", "processed", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  transactionDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

transactionSchema.pre("save", function (next) {
  this.subtotal = this.items.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  this.totalPayment = this.subtotal + this.shippingCost;

  next();
});

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);

export default Transaction;
