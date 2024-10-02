import cloudinary from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const url = await req.json();

  const publicId = url.split("/")[7];

  try {
    const result = await cloudinary.uploader.destroy(publicId);

    return NextResponse.json({ message: "Image deleted successfully", result });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error deleting image", error });
  }
}
