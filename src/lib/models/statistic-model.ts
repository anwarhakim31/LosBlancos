import mongoose from "mongoose";

const statisticSchema = new mongoose.Schema({
  income: {
    type: Number,
    required: true,
  },
  product: {
    type: Number,
    required: true,
  },
  transaction: {
    type: Number,
    required: true,
  },
});

const Statistic =
  mongoose.models.Statistic || mongoose.model("Statistic", statisticSchema);
export default Statistic;
