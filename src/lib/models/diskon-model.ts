import mongoose from "mongoose";

const diskonSchema = new mongoose.Schema({
  percent: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Diskon = mongoose.models.Diskon || mongoose.model("Diskon", diskonSchema);
export default Diskon;
