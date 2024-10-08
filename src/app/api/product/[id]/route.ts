import connectDB from "@/lib/db";
import Product from "@/lib/models/product-model";
import Stock from "@/lib/models/stock-model";
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

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return ResponseError(404, "Produk tidak ditemukan");
    }

    await Stock.deleteMany({ productId: id });

    return NextResponse.json({
      success: true,
      message: "Berhasil menambahkan produk",
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
    const {
      name,
      description,
      price,
      image,
      category,
      collection,
      attribute,
      stock,
    } = await req.json();

    const product = await Product.findByIdAndUpdate(id, {
      name,
      description,
      price,
      image,
      category,
      collection,
      attribute,
    });

    if (!product) {
      return ResponseError(404, "Produk tidak ditemukan");
    }

    await Stock.deleteMany({ productId: id });

    let totalStock = 0;

    for (const item of stock) {
      totalStock += item.stock;
      const { attribute, value, stock } = item;
      await Stock.create({ productId: id, attribute, value, stock });
    }

    await Product.findByIdAndUpdate(id, { stock: totalStock });

    return NextResponse.json({
      success: true,
      message: "Berhasil mengubah produk",
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}
