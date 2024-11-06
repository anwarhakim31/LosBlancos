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
  weight: {
    type: Number,
    required: true,
    default: 0,
  },
});

const transactionSchema = new mongoose.Schema({
  invoice: {
    type: String,
    required: true,
  },
  expired: {
    type: Date,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [transactionItemModel],
  diskon: {
    type: Number,
    required: false,
    default: 0,
  },
  subtotal: {
    type: Number,
    required: true,
    default: 0,
  },
  shippingAddress: {
    fullname: {
      type: String,
    },
    phone: {
      type: String,
    },
    province: {
      type: String,
    },
    city: {
      type: String,
    },
    subdistrict: {
      type: String,
    },
    postalCode: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  shippingCost: {
    type: Number,
    required: true,
    default: 0,
  },
  shippingName: {
    type: String,
  },
  totalPayment: {
    type: Number,
    required: true,
    default: 0,
  },
  paymentCode: {
    type: String,
  },
  paymentName: {
    type: String,
  },

  paymentMethod: {
    type: String,
    enum: ["e-wallet", "bank_transfer", "over the counter"],
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ["tertunda", "dibayar", "ditolak", "dibatalkan", "kadaluwarsa"],
    default: "tertunda",
  },
  paymentCreated: {
    type: Date,
  },
  paymentExpired: {
    type: Date,
  },
  transactionStatus: {
    type: String,
    required: true,
    enum: ["tertunda", "diproses", "dikirim", "selesai", "dibatalkan"],
    default: "tertunda",
  },
  transactionDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

transactionSchema.pre("save", function (next) {
  this.subtotal = this.items.reduce((acc, item) => {
    return acc + item.price;
  }, 0);

  // this.totalPayment = this.diskon
  //   ? this.subtotal + this.shippingCost + 1000 - this.diskon
  //   : this.subtotal + this.shippingCost + 1000;

  next();
});

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);

export default Transaction;
