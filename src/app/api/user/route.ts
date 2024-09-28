import connectDB from "@/lib/db";
import User from "@/lib/models/user-model";
import { ResponseError } from "@/lib/response-error";

import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "8");
    const skip = (page - 1) * limit;

    const user = await User.find({ role: "customer" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-password")
      .exec();

    const total = await User.countDocuments({ role: "customer" });

    return NextResponse.json(
      {
        success: true,
        user,
        pagination: {
          limit,
          page,
          total,
          totalPage: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}
