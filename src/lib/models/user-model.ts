import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer",
  },
  fullname: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  gender: {
    type: String,
    required: false,
  },
  provinsi: {
    type: String,
    required: false,
  },
  kota: {
    type: String,
    required: false,
  },
  alamat: {
    type: String,
    required: false,
  },
  status: {
    type: Boolean,
    default: false,
  },
  diskon: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
