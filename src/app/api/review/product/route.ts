import Review from "@/lib/models/review-model";
import { ResponseError } from "@/lib/response-error";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const productId = searchParams.get("productId");
    const page = Number(searchParams.get("page") || "1");

    const skip = (page - 1) * 8;

    const reviews = await Review.find({ product: productId })
      .skip(skip)
      .limit(8)
      .populate({ path: "user", select: "fullname image" })
      .sort({ updatedAt: -1 })
      .select("-transactionid -product -itemId");

    const total = await Review.countDocuments({ product: productId });

    const ratingsCount = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId as string) } },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
    ]);

    const ratingsSummary = Array.from({ length: 5 }, (_, i) => {
      const star = 5 - i;
      const ratingData = ratingsCount.find((r) => r._id === star);
      const ratingCount = ratingData ? ratingData.count : 0;

      const percentage = total > 0 ? (ratingCount / total) * 100 : 0;

      return {
        star,
        count: ratingCount,
        percentage: Math.round(percentage),
      };
    });

    return NextResponse.json({
      success: true,
      status: 200,
      message: "Berhasil mengambil ulasan produk",
      reviews,
      pagination: {
        page,
        limit: 8,
        total,
        totalPage: Math.ceil(total / 8),
      },
      ratingsSummary,
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}
