import connectDB from "@/lib/db";
import Collection from "@/lib/models/collection-model";
import { ResponseError } from "@/lib/response-error";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();
  try {
    const searcParams = req.nextUrl.searchParams;
    const slug = searcParams.get("slug");

    const collection = await Collection.findOne({ slug });

    if (!collection) {
      return ResponseError(404, "Koleksi tidak ditemukan");
    }

    return NextResponse.json({
      success: true,
      message: "Berhasil mengubah koleksi",
      banner: collection.image,
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}
