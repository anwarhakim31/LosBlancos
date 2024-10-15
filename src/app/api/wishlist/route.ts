import connectDB from "@/lib/db";
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
    return NextResponse.json({
      success: true,
      message: "Menambahkan  ke daftar keinginan",
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}

export async function GET() {
  await connectDB();
  try {
    const wishlist = await Wishlist.find({}).populate({
      path: "product",
      populate: {
        path: "collectionName",
      },
    });

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
    const id = await req.json();

    const isExist = await Wishlist.findOneAndDelete({ product: id });

    if (!isExist) {
      return ResponseError(404, "data tidak ditemukan");
    }

    return NextResponse.json({
      success: true,
      message: "Menghapus dari daftar keinginan",
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}
