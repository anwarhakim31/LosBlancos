import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  display: {
    type: Boolean,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const Banner = mongoose.models.Banner || mongoose.model("Banner", bannerSchema);
export default Banner;
