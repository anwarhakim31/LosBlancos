import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/lib/models/user-model";
import { ResponseError } from "@/lib/response-error";
import dbConnect from "@/lib/db";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { fullname, email, password } = await req.json();

    if (!fullname || !email || !password) {
      return ResponseError(400, "Semua kolom dibutuhkan");
    }

    const user = await User.findOne({ email });

    if (user) {
      return ResponseError(400, "Email sudah digunakan");
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json(
      { success: true, message: "Berhasil membuat akun" },
      { status: 201 }
    );
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}
