import connectDB from "@/lib/db";
import User from "@/lib/models/user-model";
import { ResponseError } from "@/lib/response-error";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { verifyToken } from "@/lib/verify-token";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  try {
    verifyToken(req, []);
    const body = await req.json();

    const { id } = params;

    const isExist = await User.findById(id);

    if (!isExist) {
      return ResponseError(404, "User tidak ditemukan");
    }

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
          phone: user?.phone,
          gender: user?.gender,
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
    verifyToken(req);
    const { id } = params;

    const isExist = await User.findById(id);

    if (!isExist) {
      return ResponseError(404, "User tidak ditemukan");
    }

    await User.findByIdAndDelete(id);

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
