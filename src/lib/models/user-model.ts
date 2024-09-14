import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  username: {
    type: String,
    required: true,
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
    type: Number,
    required: false,
  },
  jenisKelamin: {
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
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
