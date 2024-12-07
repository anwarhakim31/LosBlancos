import connectDB from "@/lib/db";
import Category from "@/lib/models/category-model";
import { ResponseError } from "@/lib/response-error";
import { verifyToken } from "@/lib/verify-token";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const token = verifyToken(req, ["admin"]);
  try {
    if (token instanceof NextResponse) {
      return token;
    }
    const { id } = params;

    const isExis = await Category.findById(id);

    if (!isExis) {
      return ResponseError(404, "Gagal. kategori tidak ditemukan");
    }

    await Category.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Berhasil menghapus kategori",
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const token = verifyToken(req, ["admin"]);
  try {
    if (token instanceof NextResponse) {
      return token;
    }
    const { id } = params;
    const data = await req.json();

    const isExist = await Category.findById(id);

    if (!isExist) {
      return ResponseError(404, "Koleksi tidak ditemukan");
    }

    await Category.findByIdAndUpdate(id, data);

    return NextResponse.json({
      success: true,
      message: "Berhasil mengubah koleksi",
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}
