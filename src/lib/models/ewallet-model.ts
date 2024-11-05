import mongoose from "mongoose";

const EwalletSchema = new mongoose.Schema({
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  actions: [
    {
      name: {
        type: String,
        required: true,
      },
      method: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
});

const Ewallet =
  mongoose.models.Ewallet || mongoose.model("Ewallet", EwalletSchema);

export default Ewallet;
