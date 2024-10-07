import Product from "@/lib/models/product-model";
import Stock from "@/lib/models/stock-model";
import { ResponseError } from "@/lib/response-error";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const params = new URL(req.url).searchParams;
  const page = parseInt(params.get("page") || "1");
  const limit = parseInt(params.get("limit") || "8");
  const skipp = (page - 1) * limit;

  const search = params.get("search") || "";
  const searchRegex = new RegExp(search.trim(), "i");

  const filterQuery = {
    $or: [
      { name: { $regex: searchRegex } },
      { description: { $regex: searchRegex } },
    ],
  };

  const products = await Product.find(filterQuery)
    .sort({ createdAt: -1 })
    .skip(skipp)
    .limit(limit)
    .exec();
  const total = await Product.countDocuments(filterQuery);

  return NextResponse.json({
    success: true,
    message: "Berhasil mendapatkan produk",
    products,
    pagination: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const {
      name,
      description,
      price,
      stock,
      image,
      category,
      collection,
      attribute,
    } = await req.json();

    const product = new Product({
      name,
      description,
      price,
      image,
      category,
      collection,
      attribute,
    });
    const result = await product.save();

    let totalStock = 0;

    for (const item of stock) {
      const { attribute, value, stock } = item;

      const newStock = new Stock({
        productId: result._id,
        attribute,
        value,
        stock,
      });
      await newStock.save();

      totalStock += stock;
    }

    await Product.findOneAndUpdate(
      { _id: result._id },
      { $set: { stock: totalStock } }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Berhasil menambahkan produk",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}
