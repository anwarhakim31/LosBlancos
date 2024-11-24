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
        status: 200,
      }
    );
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
    const data = await req.json();

    if (!data) {
      return ResponseError(400, "Data tidak boleh kosong");
    }

    const total = await Carousel.countDocuments();

    if (total >= 5) {
      return ResponseError(400, "Carousel tidak boleh lebih dari 5");
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
