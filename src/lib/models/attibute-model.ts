import mongoose from "mongoose";

const attributeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  value: [
    {
      type: String,
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Attribute =
  mongoose.models.Attribute || mongoose.model("Attribute", attributeSchema);

export default Attribute;
