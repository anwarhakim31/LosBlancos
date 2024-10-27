import connectDB from "@/lib/db";
import Stock from "@/lib/models/stock-model";
import Wishlist from "@/lib/models/wishlist-mode";
import { ResponseError } from "@/lib/response-error";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const { user, product } = await req.json();

    const isExist = await Wishlist.findOne({ user, product });

    if (isExist) {
      return NextResponse.json({
        success: false,
        message: "Produk ini sudah ada di daftar keinginan",
      });
    }

    const wishlist = new Wishlist({
      user,
      product,
    });

    await wishlist.save();

    const added = await Wishlist.find({ user }).populate({
      path: "product",
      populate: {
        path: "collectionName",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Menambahkan  ke daftar keinginan",
      wishlist: added,
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}

export async function GET(req: NextRequest) {
  await connectDB();
  try {
    const id = new URL(req.url).searchParams.get("user") as string;

    const wishlist = await Wishlist.find({ user: id }).populate({
      path: "product",
      populate: {
        path: "collectionName",
      },
    });

    for (const item of wishlist) {
      const stockDB = await Stock.find({
        productId: item.product._id,
      });

      const totalStock = stockDB.reduce((a, b) => a + b.stock, 0);

      if (totalStock === 0) {
        await Wishlist.findByIdAndDelete({ _id: item._id });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Berhasil mengambil wishlist",
      wishlist,
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  try {
    const { userId, productId } = await req.json();

    const updated = await Wishlist.findOneAndDelete({
      product: productId,
      user: userId,
    });

    if (!updated) {
      return ResponseError(404, "data tidak ditemukan");
    }

    const wishlist = await Wishlist.find({ user: userId }).populate({
      path: "product",
      populate: {
        path: "collectionName",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Menghapus dari daftar keinginan",
      wishlist,
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}
