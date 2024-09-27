import connectDB from "@/lib/db";
import User from "@/lib/models/user-model";
import { ResponseError } from "@/lib/response-error";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  try {
    const body = await req.json();

    const { id } = params;

    if (body.password === "") {
      delete body.password;
    }

    if (body.password) {
      const salt = await bcrypt.genSalt();
      body.password = await bcrypt.hash(body.password, salt);
    }

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
    return ResponseError(500, "Internal Server Error");
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  try {
    const { id } = params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return ResponseError(404, "Gagal. User tidak ditemukan");
    }

    return NextResponse.json(
      {
        success: true,
        message: "Berhasil menghapus user",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}
