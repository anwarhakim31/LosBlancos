import mongoose from "mongoose";

const collectionModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Collection =
  mongoose.models.Collection || mongoose.model("Collection", collectionModel);
export default Collection;
