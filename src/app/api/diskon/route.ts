import connectDB from "@/lib/db";
import Diskon from "@/lib/models/diskon-model";
import User from "@/lib/models/user-model";
import { ResponseError } from "@/lib/response-error";
import { verifyToken } from "@/lib/verify-token";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();
  const token = verifyToken(req, ["customer"]);
  try {
    const { searchParams } = req.nextUrl;

    const code = searchParams.get("code")?.toLowerCase();

    if (token instanceof NextResponse) {
      return token;
    }

    if (token && typeof token === "object" && "id" in token) {
      const user = await User.findById({ _id: token.id });

      if (code && user.diskon.includes(code)) {
        return ResponseError(400, "Kode diskon sudah digunakan");
      }
    }

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
