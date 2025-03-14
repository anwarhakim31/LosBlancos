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
    const search = searchParams.get("search")?.toString() || "";
    const skip = (page - 1) * limit;

    const searchRegex = new RegExp(search.trim(), "i");

    const filterQuery = {
      name: { $regex: searchRegex },
    };

    const category = await Category.find(filterQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await Category.countDocuments(filterQuery);

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
    const token = verifyToken(req, ["admin"]);

    if (token instanceof NextResponse) {
      return token;
    }

    const data = await req.json();

    if (data.name) {
      const isExist = await Category.findOne({ name: data.name });

      if (isExist) {
        return ResponseError(400, "Nama category sudah digunakan");
      }
    }

    const category = new Category(data);

    await category.save();

    return NextResponse.json(
      {
        success: true,
        message: "Berhasil membuat Kategori",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return ResponseError(404, "Internal Server Error");
  }
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  verifyToken(req);
  try {
    const data = await req.json();

    await Category.deleteMany({ _id: { $in: data } });

    return NextResponse.json(
      {
        success: true,
        message: "Berhasil menghapus kategori terpilih",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return ResponseError(404, "Internal Server Error");
  }
}
