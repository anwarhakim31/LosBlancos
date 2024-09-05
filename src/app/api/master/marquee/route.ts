import cloudinary from "@/lib/cloudinary";
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
  try {
    verifyToken(req);
    await connectDB();

    const { image, id } = await req.json();

    const marquee = await Marquee.findOne();

    if (!marquee) {
      return ResponseError(404, "Marquee tidak ditemukan.");
    }

    if (id > marquee.image.length) {
      return ResponseError(404, "Marquee tidak ditemukan.");
    }

    if (image !== marquee.image[parseInt(id)]) {
      const publicId = marquee.image[parseInt(id)].split("/")[7];
      await cloudinary.uploader.destroy(publicId);
    }

    marquee.image[parseInt(id)] = image;

    marquee.save();

    return NextResponse.json({
      success: true,
      message: "Marquee diperbarui",
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

    const marquee = await Marquee.findOne();

    if (!marquee) {
      return ResponseError(404, "Marquee tidak ditemukan.");
    }

    const marqueeUpdated = await Marquee.findByIdAndUpdate(marquee._id, {
      display,
    });

    console.log(display);

    return NextResponse.json({
      success: true,
      message: "Marquee " + marqueeUpdated.display ? "aktif" : "non aktif",
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}
