import connectDB from "@/lib/db";
import Category from "@/lib/models/category-model";
import { ResponseError } from "@/lib/response-error";
import { verifyToken } from "@/lib/verify-token";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "8");
    const skip = (page - 1) * limit;

    const category = await Category.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await Category.countDocuments({});

    return NextResponse.json({
      success: true,
      category,
      pagination: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return ResponseError(404, "Internal Server Error");
  }
}

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    verifyToken(req);

    const data = await req.json();

    const category = new Category(data);

    await category.save();

    return NextResponse.json(
      {
        success: true,
        message: "Berhasil membuat kategori",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return ResponseError(404, "Internal Server Error");
  }
}
