import connectDB from "@/lib/db";
import Master from "@/lib/models/master-model";
import { ResponseError } from "@/lib/response-error";
import { verifyToken } from "@/lib/verify-token";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  try {
    const master = await Master.findOne();

    if (!master) {
      const newMaster = await Master.create({
        logo: "/default.png",
        displayLogo: true,
        name: "Nama",
        color: "#000000",
        displayName: false,
        favicon: "/default.png",
      });

      return NextResponse.json({
        success: true,
        master: newMaster,
      });
    }

    return NextResponse.json({
      success: true,
      master,
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}

export async function PATCH(req: NextRequest) {
  await connectDB();
  try {
    verifyToken(req);
    const data = await req.json();
    const master = await Master.findOne();

    if (!master) {
      return ResponseError(404, "Master data tidak ditemukan");
    }

    if (data.name && data.name.length > 15) {
      return ResponseError(400, "Panjang nama logo maksimal 15 karakter");
    }

    console.log(data.color);

    if (data.color && !data.color.startsWith("#")) {
      return ResponseError(400, "Format warna harus Hexadecimal");
    }

    const dataUpdate = await Master.findByIdAndUpdate(master._id, data, {
      new: true,
    });

    return NextResponse.json({
      success: true,
      message: "Master data berhasil diperbarui",
      data: dataUpdate,
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}