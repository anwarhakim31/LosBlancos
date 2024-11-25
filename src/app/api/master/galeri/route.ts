import connectDB from "@/lib/db";
import Galeri from "@/lib/models/galeri-module";

import { ResponseError } from "@/lib/response-error";
import { verifyToken } from "@/lib/verify-token";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const galeri = await Galeri.findOne();

    const image = Array(6).fill("/default.png");

    if (!galeri) {
      const newGaleri = await Galeri.create({
        image,
      });

      return NextResponse.json({
        success: true,
        galeri: newGaleri,
      });
    }

    return NextResponse.json({
      success: true,
      galeri,
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
    await connectDB();

    const { image, id: index } = await req.json();

    const galeri = await Galeri.findOne();

    if (!galeri) {
      return ResponseError(404, "Galeri tidak ditemukan.");
    }

    if (index > galeri.image.length) {
      return ResponseError(404, "Marquee tidak ditemukan.");
    }

    galeri.image[parseInt(index)] = image;

    galeri.save();

    return NextResponse.json({
      success: true,
      message: "Galeri berhasil diperbarui",
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}
