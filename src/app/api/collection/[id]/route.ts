import cloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import Collection from "@/lib/models/collection-model";
import { ResponseError } from "@/lib/response-error";
import { verifyToken } from "@/lib/verify-token";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  try {
    verifyToken(req);
    const { id } = params;

    const isExis = await Collection.findById(id);

    if (!isExis) {
      return ResponseError(404, "Gagal. koleksi tidak ditemukan");
    }
    const publicId = isExis?.image.split("/")[7];
    await cloudinary.uploader.destroy(publicId);

    await Collection.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Berhasil menghapus koleksi",
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  try {
    verifyToken(req);
    const { id } = params;
    const data = await req.json();

    const isExist = await Collection.findById(id);

    if (!isExist) {
      return ResponseError(404, "Koleksi tidak ditemukan");
    }

    const publicId = isExist?.image.split("/")[7];

    if (data.image !== isExist.image) {
      await cloudinary.uploader.destroy(publicId);
    }

    await Collection.findByIdAndUpdate(id, data);

    return NextResponse.json({
      success: true,
      message: "Berhasil mengubah koleksi",
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}