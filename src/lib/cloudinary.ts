import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUD_APIKEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUD_SECRETKEY,
});

export default cloudinary;