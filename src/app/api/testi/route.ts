import Testimoni from "@/lib/models/testi-model";
import { ResponseError } from "@/lib/response-error";
import { verifyToken } from "@/lib/verify-token";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = verifyToken(req, ["customer"]);

    if (token instanceof NextResponse) {
      return token;
    }

    const data = await req.json();

    const testimoni = new Testimoni({
      name: data.name,
      transactionId: data.transactionId,
      image: data.image,
      comment: data.comment,
    });

    await testimoni.save();

    return NextResponse.json(
      {
        success: true,
        message: "Berhasil mengirim",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = verifyToken(req, ["customer"]);

    if (token instanceof NextResponse) {
      return token;
    }

    const searchParams = req.nextUrl.searchParams;

    const testimoni = await Testimoni.findOne({
      transactionId: searchParams.get("transactionId"),
    });

    return NextResponse.json({
      success: true,
      message: "Berhasil mengirim",
      testimoni: !!testimoni,
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}
