import connectDB from "@/lib/db";
import Banner from "@/lib/models/banner-model";

import { ResponseError } from "@/lib/response-error";
import { verifyToken } from "@/lib/verify-token";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const banner = await Banner.findOne();

    if (!banner) {
      const newMarquee = await Banner.create({
        display: true,
        image: "/banner.png",
      });

      return NextResponse.json({
        success: true,
        marquee: newMarquee,
      });
    }

    return NextResponse.json({
      success: true,
      banner,
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}

export async function POST(req: NextRequest) {
  try {
    verifyToken(req);
    await connectDB();

    const { image } = await req.json();

    const banner = await Banner.findOne();

    if (!banner) {
      return ResponseError(404, "Banner tidak ditemukan.");
    }

    banner.image = image;

    banner.save();

    return NextResponse.json({
      success: true,
      message: "Banner berhasil diperbarui",
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    verifyToken(req);

    const { display } = await req.json();

    const banner = await Banner.findOne();

    if (!Banner) {
      return ResponseError(404, "Banner tidak ditemukan.");
    }

    await Banner.findByIdAndUpdate(banner._id, {
      display,
    });

    const status = display ? "aktif" : "non aktif";
    return NextResponse.json({
      success: true,
      message: "Banner " + status,
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}