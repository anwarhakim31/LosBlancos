import Product from "@/lib/models/product-model";
import Review from "@/lib/models/review-model";
import { ResponseError } from "@/lib/response-error";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { product, comment, rating, user, invoice } = await req.json();

    const isExist = await Review.findOne({ product, user, invoice });

    if (isExist) {
      return ResponseError(400, "Ulasan sudah ada");
    }

    const review = new Review({
      product,
      comment,
      rating,
      user,
      invoice,
    });
    await review.save();

    await Product.findByIdAndUpdate(product, {
      $inc: { reviewCount: 1 },
      averageRating: Math.round((rating + review.averageRating) / 2),
    });

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
    return ResponseError(500, "Internal Server Error");
  }
}
