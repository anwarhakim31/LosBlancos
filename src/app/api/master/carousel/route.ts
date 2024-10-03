import connectDB from "@/lib/db";
import Carousel from "@/lib/models/carousel-model";
import { ResponseError } from "@/lib/response-error";
import { verifyToken } from "@/lib/verify-token";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  try {
    const carousel = await Carousel.find({});

    return NextResponse.json(
      {
        success: true,
        message: "Berhasil mendapatkan carousel",
        carousel,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    verifyToken(req);
    const data = await req.json();

    if (!data) {
      return ResponseError(400, "Data tidak boleh kosong");
    }

    const carousel = new Carousel(data);

    await carousel.save();

    return NextResponse.json(
      {
        success: true,
        message: "Berhasil membuat carousel",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}
