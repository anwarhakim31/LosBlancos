import connectDB from "@/lib/db";
import Collection from "@/lib/models/collection-model";
import Product from "@/lib/models/product-model";
import Stock from "@/lib/models/stock-model";
import { ResponseError } from "@/lib/response-error";
import { verifyToken } from "@/lib/verify-token";

import { NextRequest, NextResponse } from "next/server";

type filterQuery = {
  name: { $regex: RegExp };
  category?: { $in: string[] };
};

export async function GET(req: NextRequest) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "2");
    const category = searchParams.getAll("category") || [];

    const search = searchParams.get("search")?.toString() || "";

    const skip = (page - 1) * limit;

    const searchRegex = new RegExp(search.trim(), "i");

    const filterQuery: filterQuery = {
      name: { $regex: searchRegex },
    };

    if (category.length > 0) {
      filterQuery.category = { $in: category };
    }

    const products = await Product.find(filterQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("collectionName")
      .exec();

    const total = await Product.countDocuments(filterQuery);

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
      pagination: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.log(error);
    return ResponseError(404, "Internal Server Error");
  }
}

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    verifyToken(req);
    const {
      name,
      description,
      price,
      stock,
      image,
      category,
      collectionName,
      attribute,
    } = await req.json();

    const collectionDB = await Collection.findOne({ name: collectionName });
    if (!collectionDB) {
      return ResponseError(404, "Koleksi tidak ditemukan");
    }

    const product = new Product({
      name,
      description,
      price,
      image,
      category,
      collectionName: collectionDB._id,
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

export async function DELETE(req: NextRequest) {
  await connectDB();
  try {
    verifyToken(req);
    const data = await req.json();

    for (const id of data) {
      const isExist = await Product.findById(id);

      if (!isExist) {
        return ResponseError(404, "Produk tidak ditemukan ");
      }
    }

    await Product.deleteMany({ _id: { $in: data } });

    await Stock.deleteMany({ productId: { $in: data } });

    return NextResponse.json({
      success: true,
      message: "Berhasil menambahkan produk",
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}
