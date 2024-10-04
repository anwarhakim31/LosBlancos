import mongoose from "mongoose";

const masterModel = new mongoose.Schema({
  logo: {
    type: String,
    required: false,
  },
  displayLogo: {
    type: Boolean,
    required: true,
  },
  name: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    required: false,
  },
  displayName: {
    type: Boolean,
    required: true,
  },
  favicon: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
});

const Master = mongoose.models.Master || mongoose.model("Master", masterModel);
export default Master;
