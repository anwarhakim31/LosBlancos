import mongoose from "mongoose";

const shippingAddress = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName: { type: String, required: true },
  province: { type: String, required: true },
  city: { type: String, required: true },
  subdistrict: { type: String, required: true },
  postalCode: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
});

const ShippingAddress =
  mongoose.models.ShippingAddress ||
  mongoose.model("ShippingAddress", shippingAddress);

export default ShippingAddress;
