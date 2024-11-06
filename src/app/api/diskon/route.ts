import Diskon from "@/lib/models/diskon-model";
import { ResponseError } from "@/lib/response-error";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { code, percent } = await req.json();

    code.toLowerCase();

    if (!code || !percent) {
      return ResponseError(400, "Semua kolom harus diisi");
    }
    const isExis = await Diskon.findOne({ code });

    if (isExis) {
      return ResponseError(400, "Diskon dengan kode ini sudah ada");
    }

    const diskon = new Diskon({ code, percent });

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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const code = searchParams.get("code")?.toLowerCase();

    const diskon = await Diskon.findOne({ code });

    if (!diskon) {
      return ResponseError(404, "Kode diskon salah");
    }

    await diskon.save();

    return NextResponse.json({
      success: true,
      message: "Berhasil menambahkan diskon",
      discount: diskon,
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}
