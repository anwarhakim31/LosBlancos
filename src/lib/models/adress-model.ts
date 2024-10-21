import mongoose from "mongoose";

const shippingAddress = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullname: { type: String, required: true },
  province: {
    id: { type: String, required: true },
    name: { type: String, required: true },
  },
  city: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    id_province: { type: String, required: true },
  },
  subdistrict: { type: String, required: true },
  postalCode: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ShippingAddress =
  mongoose.models.ShippingAddress ||
  mongoose.model("ShippingAddress", shippingAddress);

export default ShippingAddress;
