import Category from "@/lib/models/category-model";
import { ResponseError } from "@/lib/response-error";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return ResponseError(404, "Gagal. Kategori tidak ditemukan");
    }

    return NextResponse.json({
      success: true,
      message: "Berhasil menghapus kategori",
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}
