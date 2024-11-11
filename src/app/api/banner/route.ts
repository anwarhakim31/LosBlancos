import Master from "@/lib/models/master-model";
import { ResponseError } from "@/lib/response-error";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const banner = await Master.findOne({});

    return NextResponse.json({
      success: true,
      message: "Data berhasil diambil",
      banner: banner.banner,
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}
