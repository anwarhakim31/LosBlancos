import Diskon from "@/lib/models/diskon-model";
import { ResponseError } from "@/lib/response-error";
import { NextRequest, NextResponse } from "next/server";

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

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();

    await Diskon.deleteMany({ _id: { $in: body } });

    return NextResponse.json({
      success: true,
      message: "Berhasil menghapus diskon terpilih",
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}
