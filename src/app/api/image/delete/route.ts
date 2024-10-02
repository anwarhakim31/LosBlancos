import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUD_APIKEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUD_APISECRET,
});

export async function DELETE(req: NextRequest) {
  const url = await req.json();

  const publicId = url.split("/")[7];

  try {
    const result = await cloudinary.uploader.destroy(publicId);

    return NextResponse.json({ message: "Image deleted successfully", result });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting image", error });
  }
}
