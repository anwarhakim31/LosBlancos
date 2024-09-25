import connectDB from "@/lib/db";
import User from "@/lib/models/user-model";
import { ResponseError } from "@/lib/response-error";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import cloudinary from "cloudinary";

// Konfigurasi Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    const body = await req.json();
    const { id } = params;

    // Jika password kosong, hapus dari body agar tidak ikut ter-update
    if (body.password === "") {
      delete body.password;
    }

    // Jika password ada, lakukan hash
    if (body.password) {
      const salt = await bcrypt.genSalt();
      body.password = await bcrypt.hash(body.password, salt);
    }

    // Ambil user yang saat ini ada di database
    const existingUser = await User.findById(id);

    if (!existingUser) {
      return ResponseError(404, "User not found");
    }

    if (body.image && body.image !== existingUser.image) {
      const oldImagePublicId = existingUser.image
        ?.split("/")
        .pop()
        ?.split(".")[0];

      if (oldImagePublicId) {
        await cloudinary.v2.uploader.destroy(oldImagePublicId);
      }
    }

    // Perbarui data user di MongoDB
    const user = await User.findByIdAndUpdate(id, body, { new: true });

    return NextResponse.json(
      {
        success: true,
        message: "Berhasil mengubah data",
        data: {
          name: user?.fullname,
          email: user?.email,
          image: user?.image,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return ResponseError(500, "Internal Server Error");
  }
}
