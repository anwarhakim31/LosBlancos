import Product from "@/lib/models/product-model";
import Review from "@/lib/models/review-model";
import { ResponseError } from "@/lib/response-error";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { product, comment, rating, user, transactionId, itemId } =
      await req.json();

    const isExist = await Review.findOne({
      transactionId: new mongoose.Types.ObjectId(transactionId),
      itemId: new mongoose.Types.ObjectId(itemId),
    });

    if (isExist) {
      return ResponseError(400, "Ulasan sudah ada");
    }

    const review = new Review({
      product,
      comment,
      rating: Number(rating),
      user,
      transactionId,
      itemId,
    });
    await review.save();

    if (review.rating) {
      const products = await Product.findById(product);

      if (!products) {
        throw new Error("Product not found");
      }

      const average = products.averageRating || 0;
      const count = products.reviewCount || 0;

      products.reviewCount = count + 1;

      if (average === 0) {
        products.averageRating = review.rating;
      } else {
        products.averageRating =
          (average * count + review.rating) / products.reviewCount;
      }

      await products.save();
    }

    return NextResponse.json(
      {
        success: true,
        status: 201,
        message: "Berhasil menambahkan ulasan",
        review,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const transactionId = searchParams.get("transactionId");

    const review = await Review.find({ transactionId });

    return NextResponse.json({
      success: true,
      status: 200,
      message: "Berhasil mengambil ulasan",
      review,
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}
