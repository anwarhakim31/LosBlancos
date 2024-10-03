import cloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import Carousel from "@/lib/models/carousel-model";
import { ResponseError } from "@/lib/response-error";
import { verifyToken } from "@/lib/verify-token";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    verifyToken(req);

    const { id } = params;

    const carousel = await Carousel.findById(id);

    if (!carousel) {
      return ResponseError(404, "Gagal. Carousel tidak ditemukan");
    }

    const total = await Carousel.countDocuments();

    if (total <= 1) {
      return ResponseError(400, "Gagal. Carousel tidak boleh kosong");
    }

    const publicId = carousel?.image.split("/")[7];

    await cloudinary.uploader.destroy(publicId);

    await Carousel.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: "Berhasil menghapus carousel",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    verifyToken(req);
    const data = await req.json();
    const { id } = params;

    const carousel = await Carousel.findById(id);

    if (!carousel) {
      return ResponseError(404, "Gagal. Carousel tidak ditemukan");
    }

    const publicId = carousel?.image.split("/")[7];

    if (data.image !== carousel.image) {
      await cloudinary.uploader.destroy(publicId);
    }

    await Carousel.findByIdAndUpdate(id, data);

    return NextResponse.json(
      {
        success: true,
        message: "Berhasil mengubah carousel",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}
