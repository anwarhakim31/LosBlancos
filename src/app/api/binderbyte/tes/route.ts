import { ResponseError } from "@/lib/response-error";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const key = "ae3be4fdc283180a41cdb74494fe79d3";

    const res = await fetch(
      "https://api.rajaongkir.com/starter/province?key=" + key
    );

    const province = await res.json();

    return NextResponse.json({
      success: true,
      message: "Berhasil mengambil tarif ongkir",
      province,
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}
