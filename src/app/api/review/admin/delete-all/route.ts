import Review from "@/lib/models/review-model";
import { ResponseError } from "@/lib/response-error";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const data = await req.json();

    await Review.deleteMany({ _id: { $in: data } });

    return NextResponse.json({
      success: true,
      status: 200,
      message: "Berhasil menghapus ulasan produk terpilih",
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}
