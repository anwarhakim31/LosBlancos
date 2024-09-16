import mongoose from "mongoose";

const verifyTokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  expired: {
    type: Date,
    required: true,
  },
});

const VerifyToken =
  mongoose.models.VerifyToken ||
  mongoose.model("VerifyToken", verifyTokenSchema);

export default VerifyToken;
