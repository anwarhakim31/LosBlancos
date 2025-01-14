import mongoose from "mongoose";

const testiSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Testimoni =
  mongoose.models.Testimoni || mongoose.model("Testimoni", testiSchema);
export default Testimoni;
