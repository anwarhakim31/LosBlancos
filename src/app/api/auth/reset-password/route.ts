import VerifyToken from "@/lib/models/verify-model";
import { ResponseError } from "@/lib/response-error";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/lib/models/user-model";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token) {
      return ResponseError(400, "Token tidak valid");
    }

    const verify = await VerifyToken.findById({ _id: token });

    if (!verify) {
      return ResponseError(400, "Token tidak valid");
    }

    const hasExpired =
      new Date().getTime() > new Date(verify.expired).getTime();

    if (hasExpired) {
      await VerifyToken.findByIdAndDelete({ _id: token });

      return ResponseError(400, "Token sudah kadaluarsa");
    }

    const user = await User.findOne({ email: verify.email });

    if (!user) {
      return ResponseError(400, "Email tidak valid");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    await user.save();

    await VerifyToken.findByIdAndDelete({ _id: token });

    return NextResponse.json(
      {
        success: true,
        message: "Password berhasil diubah",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal server error");
  }
}
