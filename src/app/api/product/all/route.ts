import connectDB from "@/lib/db";

import Product from "@/lib/models/product-model";
import Stock from "@/lib/models/stock-model";
import { ResponseError } from "@/lib/response-error";

import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .populate("collectionName")
      .exec();

    const stockAtribut = await Stock.find({
      productId: { $in: products.map((p) => p._id) },
    });

    const updatedProducts = products.map((product) => {
      const stock = stockAtribut.filter(
        (s) => s.productId.toString() === product._id.toString()
      );

      return {
        ...product.toObject(),
        stockAtribut: stock,
      };
    });

    return NextResponse.json({
      success: true,
      products: updatedProducts,
    });
  } catch (error) {
    console.log(error);
    return ResponseError(404, "Internal Server Error");
  }
}
