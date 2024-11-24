import Testimoni from "@/lib/models/testi-model";
import { ResponseError } from "@/lib/response-error";
import { verifyToken } from "@/lib/verify-token";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = verifyToken(req, ["admin"]);

    if (token instanceof NextResponse) {
      return token;
    }

    const searchParams = req.nextUrl.searchParams;

    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const skip = (Number(page) - 1) * Number(limit);
    const search = searchParams.get("search") || "";

    const searchRegex = new RegExp(search.trim().toLocaleLowerCase(), "i");

    const testimoni = await Testimoni.find({ comment: { $regex: searchRegex } })
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .lean();

    const total = await Testimoni.countDocuments();

    return NextResponse.json({
      success: true,
      message: "Berhasil mengambil testimoni",
      testimoni: testimoni,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: total,
        totalPage: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = verifyToken(req, ["admin"]);

    if (token instanceof NextResponse) {
      return token;
    }

    const searchParams = req.nextUrl.searchParams;

    const id = searchParams.get("transactionId");

    if (!id) {
      return ResponseError(400, "Semua kolom harus diisi");
    }

    await Testimoni.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Berhasil menghapus testimoni",
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = verifyToken(req, ["admin"]);

    if (token instanceof NextResponse) {
      return token;
    }

    const searchParams = req.nextUrl.searchParams;

    const id = searchParams.get("transactionId");

    const testimoni = await Testimoni.findById(id);

    testimoni.status = !testimoni.status;

    await testimoni.save();

    return NextResponse.json({
      success: true,
      message: "Berhasil mengubah status testimoni",
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}
