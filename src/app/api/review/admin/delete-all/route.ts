import Product from "@/lib/models/product-model";
import Review from "@/lib/models/review-model";
import { ResponseError } from "@/lib/response-error";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const data = await req.json();
    const reviews = await Review.find({ _id: { $in: data } });

    if (!reviews || reviews.length === 0) {
      return ResponseError(
        404,
        "Tidak ada ulasan yang ditemukan untuk dihapus"
      );
    }

    const productUpdates: {
      [productId: string]: {
        ratingsToSubtract: number;
        reviewsToSubtract: number;
      };
    } = {};

    reviews.forEach((review) => {
      if (!productUpdates[review.product]) {
        productUpdates[review.product] = {
          ratingsToSubtract: 0,
          reviewsToSubtract: 0,
        };
      }
      productUpdates[review.product].ratingsToSubtract += review.rating;
      productUpdates[review.product].reviewsToSubtract += 1;
    });

    for (const productId of Object.keys(productUpdates)) {
      const product = await Product.findById(productId);

      if (product) {
        const { ratingsToSubtract, reviewsToSubtract } =
          productUpdates[productId];
        const newTotalReviews = product.totalReviews - reviewsToSubtract;

        if (newTotalReviews <= 0) {
          product.totalReviews = 0;
          product.averageRating = 0;
        } else {
          const totalRating = product.averageRating * product.totalReviews;
          const newAverageRating =
            (totalRating - ratingsToSubtract) / newTotalReviews;
          product.totalReviews = newTotalReviews;
          product.averageRating = newAverageRating;
        }

        await product.save();
      }
    }

    await Review.deleteMany({ _id: { $in: data } });

    return NextResponse.json({
      success: true,
      status: 200,
      message: "Berhasil menghapus ulasan produk terpilih dan memperbarui data",
    });
  } catch (error) {
    console.error(error);
    return ResponseError(500, "Internal Server Error");
  }
}
