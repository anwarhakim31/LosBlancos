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
  media: [
    {
      name: {
        type: String,
        required: false,
      },
      url: {
        type: String,
        required: false,
      },
    },
  ],
  email: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  googleMap: {
    type: String,
    required: false,
  },
  address: {
    street: {
      type: String,
      required: false,
    },
    postalCode: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    province: {
      type: String,
      required: false,
    },
    subdistrict: {
      type: String,
      required: false,
    },
  },
});

const Master = mongoose.models.Master || mongoose.model("Master", masterModel);
export default Master;
