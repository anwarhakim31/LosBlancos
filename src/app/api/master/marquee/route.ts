import connectDB from "@/lib/db";
import Marquee from "@/lib/models/marquee-model";
import { ResponseError } from "@/lib/response-error";
import { verifyToken } from "@/lib/verify-token";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const marquee = await Marquee.findOne();

    const image = Array(4).fill("/default.png");

    if (!marquee) {
      const newMarquee = await Marquee.create({
        display: true,
        image,
      });

      return NextResponse.json({
        success: true,
        marquee: newMarquee,
      });
    }

    return NextResponse.json({
      success: true,
      marquee,
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const token = verifyToken(req, ["admin"]);

    if (token instanceof NextResponse) {
      return token;
    }

    const { image, id: index } = await req.json();

    const marquee = await Marquee.findOne();

    if (!marquee) {
      return ResponseError(404, "Marquee tidak ditemukan.");
    }

    if (index > marquee.image.length) {
      return ResponseError(404, "Marquee tidak ditemukan.");
    }

    marquee.image[parseInt(index)] = image;

    marquee.save();

    return NextResponse.json({
      success: true,
      message: "Marquee berhasil diperbarui",
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
    console.log(display);
    const marquee = await Marquee.findOne();

    if (!marquee) {
      return ResponseError(404, "Marquee tidak ditemukan.");
    }

    await Marquee.findByIdAndUpdate(marquee._id, {
      display,
    });

    const status = display ? "aktif" : "non aktif";
    return NextResponse.json({
      success: true,
      message: "Marquee " + status,
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}
