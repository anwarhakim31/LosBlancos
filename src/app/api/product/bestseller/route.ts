import connectDB from "@/lib/db";
import Product from "@/lib/models/product-model";
import { ResponseError } from "@/lib/response-error";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  try {
    const products = await Product.find({ sold: { $gt: 0 } })
      .limit(4)
      .sort({ sold: -1 })
      .populate({ path: "collectionName" });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}
