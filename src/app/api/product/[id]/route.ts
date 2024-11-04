import connectDB from "@/lib/db";
import Collection from "@/lib/models/collection-model";
import Product from "@/lib/models/product-model";
import Stock from "@/lib/models/stock-model";
import { ResponseError } from "@/lib/response-error";
import { verifyToken } from "@/lib/verify-token";
import { TypeStock } from "@/services/type.module";

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  try {
    const { id } = params;

    const product = await Product.findById(id).populate("collectionName stock");

    if (!product) {
      return ResponseError(404, "Produk tidak ditemukan");
    }

    return NextResponse.json({
      success: true,
      message: "Berhasil mendapatkan produk",
      product,
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}

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
      collectionName,
      attribute,
      stock,
      weight,
    } = await req.json();

    const collectionDB = await Collection.findOne({ name: collectionName });
    if (!collectionDB) {
      return ResponseError(404, "Koleksi tidak ditemukan");
    }

    const product = await Product.findByIdAndUpdate(id, {
      name,
      description,
      price,
      image,
      category,
      collectionName: collectionDB._id,
      attribute,
      stock: [],
      weight,
    });

    if (!product) {
      return ResponseError(404, "Produk tidak ditemukan");
    }

    await Stock.deleteMany({ productId: id });

    const stockPromises = stock.map(async (item: TypeStock) => {
      const { attribute, value, stock } = item;
      const stockDB = await Stock.create({
        productId: id,
        attribute,
        value,
        stock,
      });
      return stockDB._id;
    });

    const stockIds = await Promise.all(stockPromises);

    await product.updateOne({ $set: { stock: stockIds } });

    return NextResponse.json({
      success: true,
      message: "Berhasil mengubah produk",
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}
