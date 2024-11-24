import Diskon from "@/lib/models/diskon-model";
import { ResponseError } from "@/lib/response-error";
import { verifyToken } from "@/lib/verify-token";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "8");
    const skip = (page - 1) * limit;
    const search =
      searchParams.get("search")?.toString().toLocaleLowerCase() || "";

    const searchRegex = new RegExp(search.trim(), "i");

    const filterQuery = {
      $or: [
        { description: { $regex: searchRegex } },
        { code: { $regex: searchRegex } },
      ],
    };

    const diskon = await Diskon.find(filterQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await Diskon.countDocuments(filterQuery);

    return NextResponse.json({
      success: true,
      diskon,
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
  try {
    const token = verifyToken(req, ["admin"]);

    if (token instanceof NextResponse) {
      return token;
    }
    const { code, percent, info } = await req.json();

    const codeLowerCase = code.toLowerCase();

    if (!code || !percent) {
      return ResponseError(400, "Semua kolom harus diisi");
    }
    const isExis = await Diskon.findOne({ code: codeLowerCase });

    if (isExis) {
      return ResponseError(400, "Diskon dengan kode ini sudah ada");
    }

    const diskon = new Diskon({ code: codeLowerCase, percent, info });

    await diskon.save();

    return NextResponse.json({
      success: true,
      message: "Berhasil menambahkan diskon",
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { code, percent, info, id } = await req.json();

    if (!code || !percent || !id) {
      return ResponseError(400, "Semua kolom harus diisi");
    }

    const diskon = await Diskon.findById(id);

    if (!diskon) {
      return ResponseError(404, "Diskon tidak ditemukan");
    }

    diskon.code = code;
    diskon.percent = percent;
    diskon.info = info;

    await diskon.save();

    return NextResponse.json({
      success: true,
      message: "Berhasil mengubah diskon",
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");

    if (!id) {
      return ResponseError(400, "Semua kolom harus diisi");
    }
    const diskon = await Diskon.findByIdAndDelete(id);
    if (!diskon) {
      return ResponseError(404, "Diskon tidak ditemukan");
    }
    return NextResponse.json({
      success: true,
      message: "Berhasil menghapus diskon",
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}
