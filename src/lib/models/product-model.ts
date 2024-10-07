import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: [
      {
        type: String,
      },
    ],
    stock: [
      {
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
        },
      },
    ],
    category: [
      {
        type: String,
        required: true,
      },
    ],
    status: {
      type: String,
      required: false,
    },
    collection: {
      type: String,
      required: true,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
