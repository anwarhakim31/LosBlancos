import Product from "@/lib/models/product-model";
import Review from "@/lib/models/review-model";
import { ResponseError } from "@/lib/response-error";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "8");
    const skip = (page - 1) * limit;
    const search = searchParams.get("search")?.toLocaleLowerCase() || "";

    const searchRegex = new RegExp(search.trim(), "i");

    const product = await Product.find().select("_id");

    const query = {
      product: { $in: product.map((p) => p._id) },
      comment: { $regex: searchRegex },
    };

    const reviews = await Review.find(query)
      .skip(skip)
      .limit(limit)
      .populate({ path: "user", select: "fullname -_id" })
      .populate({ path: "product", select: "name -_id" })
      .sort({ updatedAt: -1 })
      .lean();

    const total = await Review.countDocuments(query);

    return NextResponse.json({
      success: true,
      status: 200,
      message: "Berhasil mengambil ulasan produk",
      reviews: reviews.map((r) => ({
        ...r,
        product: r.product.name,
        user: r.user.fullname,
      })),
      pagination: {
        page,
        limit: 8,
        total,
        totalPage: Math.ceil(total / 8),
      },
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const reviewId = searchParams.get("reviewId");
    const { comment } = await req.json();

    const review = await Review.findById(reviewId);

    if (!review) {
      return ResponseError(404, "Ulasan tidak ditemukan");
    }

    review.comment = comment;
    await review.save();

    return NextResponse.json({
      success: true,
      status: 200,
      message: "Berhasil mengubah ulasan produk",
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const reviewId = searchParams.get("reviewId");

    const review = await Review.findById(reviewId);

    if (!review) {
      return ResponseError(404, "Ulasan tidak ditemukan");
    }

    const product = await Product.findById(review.product);
    if (!product) {
      return ResponseError(404, "Produk tidak ditemukan");
    }

    const totalReviews = product.reviewCount;
    const averageRating = product.averageRating;

    if (totalReviews <= 1) {
      product.reviewCount = 0;
      product.averageRating = 0;
    } else {
      const newTotalReviews = totalReviews - 1;
      const newAverageRating =
        (averageRating * totalReviews - review.rating) / newTotalReviews;

      product.reviewCount = newTotalReviews;
      product.averageRating = Math.round(newAverageRating);
    }

    await product.save();
    await Review.findByIdAndDelete(reviewId);

    return NextResponse.json({
      success: true,
      status: 200,
      message: "Berhasil menghapus ulasan produk dan memperbarui data",
    });
  } catch (error) {
    console.error(error);
    return ResponseError(500, "Internal Server Error");
  }
}
