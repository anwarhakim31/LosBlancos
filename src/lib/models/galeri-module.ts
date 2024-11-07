import mongoose from "mongoose";

const galeriSchema = new mongoose.Schema({
  image: [
    {
      type: String,
      required: true,
    },
  ],
});

const Galeri = mongoose.models.Galeri || mongoose.model("Galeri", galeriSchema);
export default Galeri;
