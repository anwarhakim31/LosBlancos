import connectDB from "@/lib/db";
import Attribute from "@/lib/models/attibute-model";
import { ResponseError } from "@/lib/response-error";
import { verifyToken } from "@/lib/verify-token";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    const token = verifyToken(req, ["admin"]);

    if (token instanceof NextResponse) {
      return token;
    }
    const { id } = params;

    const attribute = await Attribute.findOneAndDelete({ _id: id });

    if (!attribute) {
      return ResponseError(404, "Atribut tidak ditemukan");
    }

    return NextResponse.json({
      success: true,
      message: "Berhasil menghapus atribut",
    });
  } catch (error) {
    ResponseError(500, "Internal Server Error");
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    const token = verifyToken(req, ["admin"]);

    if (token instanceof NextResponse) {
      return token;
    }
    const { id } = params;
    const data = await req.json();

    const attribute = await Attribute.findOneAndUpdate({ _id: id }, data);

    if (!attribute) {
      return ResponseError(404, "Atribut tidak ditemukan");
    }

    return NextResponse.json({
      success: true,
      message: "Berhasil mengubah atribut",
    });
  } catch (error) {
    ResponseError(500, "Internal Server Error");
  }
}
