import Product from "@/lib/models/product-model";
import { ResponseError } from "@/lib/response-error";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Berhasil mendapatkan produk",
  });
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const product = new Product(data);

    await product.save();

    return NextResponse.json({
      success: true,
      message: "Berhasil membuat produk",
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}
