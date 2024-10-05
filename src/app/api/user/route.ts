import connectDB from "@/lib/db";
import User from "@/lib/models/user-model";
import { ResponseError } from "@/lib/response-error";
import { verifyToken } from "@/lib/verify-token";

import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    verifyToken(req);
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "8");
    const search = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    const searchRegex = new RegExp(search?.toString().trim(), "i");

    const fileterQuery = {
      role: "customer",
      $or: [
        { fullname: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
      ],
    };

    const user = await User.find(fileterQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-password")
      .exec();

    const total = await User.countDocuments(fileterQuery);

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
export async function DELETE(req: NextRequest) {
  await connectDB();
  try {
    verifyToken(req);

    const data = await req.json();

    if (data.length === 0) {
      return ResponseError(400, "Data tidak boleh kosong");
    }

    for (const id of data) {
      const isExist = await User.findById(id);

      if (!isExist) {
        return ResponseError(404, "User tidak ditemukan");
      }
    }

    await User.deleteMany({ _id: { $in: data } });

    return NextResponse.json(
      { success: true, message: "Berhasil menghapus data" },
      { status: 200 }
    );
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}
