import connectDB from "@/lib/db";
import User from "@/lib/models/user-model";
import { ResponseError } from "@/lib/response-error";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  try {
    const user = await User.find({ role: "customer" }).select("-password");

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}
