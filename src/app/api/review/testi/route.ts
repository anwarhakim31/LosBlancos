import Review from "@/lib/models/review-model";
import { ResponseError } from "@/lib/response-error";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const review = await Review.find({
      rating: 5,
      $expr: {
        $gt: [{ $strLenCP: "$comment" }, 50],
      },
    })
      .limit(6)
      .populate({ path: "user", select: "fullname image -_id" });

    const minimumRequired = 6;
    const dummyData = Array.from(
      { length: minimumRequired - review.length },
      (_, index) => ({
        user: { fullname: `Dummy ${index + 1}`, image: `/default.png` },
        rating: 5,
        isDummy: true,
      })
    );

    const finalReview = [...review, ...dummyData];

    return NextResponse.json({ success: true, review: finalReview });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}
