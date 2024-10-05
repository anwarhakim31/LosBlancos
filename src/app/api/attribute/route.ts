import connectDB from "@/lib/db";
import Attribute from "@/lib/models/attibute-model";
import { ResponseError } from "@/lib/response-error";
import { verifyToken } from "@/lib/verify-token";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);

    const limit = parseInt(searchParams.get("limit") || "8");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const search = searchParams.get("search")?.toString() || "";
    const searchRegex = new RegExp(search, "i");

    const attribute = await Attribute.find({ name: { $regex: searchRegex } })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    const total = await Attribute.countDocuments({
      name: { $regex: searchRegex },
    });

    return NextResponse.json({
      success: true,
      attribute,
      pagination: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    verifyToken(req);
    const data = await req.json();

    const attribute = new Attribute({
      ...data,
    });

    attribute.save();

    return NextResponse.json({
      success: true,
      message: "Berhasil membuat atribut",
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  try {
    verifyToken(req);
    const data = await req.json();

    for (const id of data) {
      const isExist = await Attribute.findById(id);

      if (!isExist) {
        return ResponseError(404, "Atribut tidak ditemukan");
      }
    }

    await Attribute.deleteMany({ _id: { $in: data } });

    return NextResponse.json({
      success: true,
      message: "Berhasil mehapus data terpilih",
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}
