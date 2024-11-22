import connectDB from "@/lib/db";
import Collection from "@/lib/models/collection-model";
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

    const collection = await Collection.find(filterQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await Collection.countDocuments(filterQuery);

    return NextResponse.json({
      success: true,
      collection,
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

    const { name, image, description } = await req.json();

    const total = await Collection.countDocuments();
    if (total >= 8) {
      return ResponseError(400, "Koleksi tidak boleh lebih dari 8");
    }

    if (name) {
      const isExist = await Collection.findOne({ name });

      if (isExist) {
        return ResponseError(400, "Nama kolek sudah digunakan");
      }
    }

    const slug = name.replace(/\s+/g, "-").toLowerCase();

    const collection = new Collection({
      name,
      image,
      description,
      slug,
    });

    await collection.save();

    return NextResponse.json(
      {
        success: true,
        message: "Berhasil membuat koleksi",
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
  try {
    verifyToken(req);

    const data = await req.json();

    await Collection.deleteMany({ _id: { $in: data } });

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
