import connectDB from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  return new NextResponse("Keep-alive", { status: 200 });
}
