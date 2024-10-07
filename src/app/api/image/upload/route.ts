import cloudinary from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const file = formData.get("file") as File;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const base64 = buffer.toString("base64");

  const originalFileName = `${uuid()}/${file.name.split(".")[0]}`;

  try {
    const result = await cloudinary.uploader.upload(
      `data:${file.type};base64,${base64}`,
      {
        folder: "losblancos",
        resource_type: "auto",
        public_id: originalFileName,
        overwrite: true,
      }
    );

    console.log(result.secure_url);

    return NextResponse.json({
      message: "Image deleted successfully",
      result,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error deleting image", error });
  }
}
