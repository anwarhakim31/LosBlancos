import mongoose from "mongoose";

const marqueeModel = new mongoose.Schema({
  display: {
    type: Boolean,
    required: true,
  },
  image: [
    {
      type: String,
      required: true,
    },
  ],
});

const Marquee =
  mongoose.models.Marquee || mongoose.model("Marquee", marqueeModel);
export default Marquee;
