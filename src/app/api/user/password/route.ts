import connectDB from "@/lib/db";
import User from "@/lib/models/user-model";
import { ResponseError } from "@/lib/response-error";
import { verifyToken } from "@/lib/verify-token";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  await connectDB();
  const token = verifyToken(req);
  try {
    if (token instanceof NextResponse) {
      return token;
    }

    const { userId, oldPassword, newPassword } = await req.json();

    const user = await User.findById(userId);

    if (!user) {
      return ResponseError(404, "User tidak ditemukan");
    }

    if (token && typeof token === "object" && "id" in token) {
      if (token.id !== userId) {
        return ResponseError(404, "anda bukan pemilik akun ini");
      }
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return ResponseError(400, "Password lama salah");
    }

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Berhasil mengganti password anda",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}
