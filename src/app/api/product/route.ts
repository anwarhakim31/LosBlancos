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
  price?: { $gte: number; $lte: number };
  collectionName?: string;
};

function escapeRegex(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(req: NextRequest) {
  await connectDB();
  try {
    const token = verifyToken(req);

    let status = 200;

    if (token && typeof token === "object" && "status" in token) {
      status = token.status;
    }

    const { searchParams } = new URL(req.url);
    let page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "8");
    const category = searchParams.getAll("category") || [];
    const max = searchParams.get("max");
    const min = searchParams.get("min");
    const collection = searchParams.get("collection");
    const sold = searchParams.get("sold");

    const sanitizedCollection = collection
      ? collection.replace(/[^a-zA-Z0-9]/g, " ")
      : "";

    const search = searchParams.get("search")?.toString() || "";

    const skip = (page - 1) * limit;

    const searchRegex = new RegExp(escapeRegex(search.trim()), "i");

    const filterQuery: filterQuery = {
      name: { $regex: searchRegex },
    };

    if (min || max) {
      filterQuery.price = {
        $lte: parseInt(max || "0"),
        $gte: parseInt(min || "500000"),
      };
      page = 1;
    }

    if (category.length > 0) {
      filterQuery.category = { $in: category };
      page = 1;
    }

    if (collection) {
      const { _id } = await Collection.findOne({
        name: sanitizedCollection,
      }).select("_id");

      if (!_id)
        return NextResponse.json(
          {
            success: false,
            message: "Koleksi tidak ditemukan",
            products: [],
            pagination: { page: 0, limit: 0, total: 0 },
          },
          { status: 404 }
        );

      filterQuery.collectionName = _id;

      page = 1;
    }

    const sort: { [key: string]: -1 | 1 } = {};

    if (sold) {
      sort.sold = sold === "asc" ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    const products = await Product.aggregate([
      {
        $match: filterQuery,
      },
      {
        $lookup: {
          from: "stocks",
          localField: "stock",
          foreignField: "_id",
          as: "stock",
        },
      },
      {
        $lookup: {
          from: "collections",
          localField: "collectionName",
          foreignField: "_id",
          as: "collectionName",
        },
      },
      {
        $unwind: {
          path: "$collectionName",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          totalStock: { $sum: "$stock.stock" },
        },
      },
      {
        $match: {
          ...(token && status === 401 ? { totalStock: { $gt: 0 } } : {}),
        },
      },
      {
        $sort: sort,
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    const total = await Product.aggregate([
      { $match: filterQuery },
      {
        $lookup: {
          from: "stocks",
          localField: "stock",
          foreignField: "_id",
          as: "stock",
        },
      },

      {
        $addFields: {
          totalStock: { $sum: "$stock.stock" },
        },
      },
      {
        $match: {
          ...(token && status === 401 ? { totalStock: { $gt: 0 } } : {}),
        },
      },
      { $count: "count" },
    ]);

    const totalPage = total.length > 0 ? Math.ceil(total[0].count / limit) : 0;

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total: total.length > 0 ? total[0].count : 0,
        totalPage,
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
      weight,
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
      weight: parseInt(weight),
    });
    const result = await product.save();

    for (const item of stock) {
      const { attribute, value, stock } = item;

      const newStock = new Stock({
        productId: result._id,
        attribute,
        value,
        stock,
      });
      await newStock.save();

      await Product.findByIdAndUpdate(result._id, {
        $push: {
          stock: newStock._id,
        },
      });
    }

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
