import Testimoni from "@/lib/models/testi-model";
import { ResponseError } from "@/lib/response-error";
import { verifyToken } from "@/lib/verify-token";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const token = verifyToken(req, ["admin"]);

    if (token instanceof NextResponse) {
      return token;
    }

    const data = await req.json();

    await Testimoni.deleteMany({ _id: { $in: data } });

    return NextResponse.json({
      success: true,
      message: "Berhasil menghapus testimoni terpilih",
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}

export async function GET() {
  try {
    const testimoni = await Testimoni.find({ status: true }).sort({
      updatedAt: -1,
    });

    return NextResponse.json({
      success: true,
      message: "Berhasil medapatkan testimoni terpilih",
      testimoni: testimoni,
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}
