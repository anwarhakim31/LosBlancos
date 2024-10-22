import mongoose from "mongoose";

const cartItemModel = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
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

const cartModel = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [cartItemModel],
  total: {
    type: Number,
    required: true,
    default: 0,
  },
});

cartModel.pre("save", function (next) {
  this.total = this.items.reduce((acc, item) => {
    return acc + item.price;
  }, 0);

  next();
});

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartModel);

export default Cart;
