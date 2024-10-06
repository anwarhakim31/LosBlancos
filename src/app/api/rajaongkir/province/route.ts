import { ResponseError } from "@/lib/response-error";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.rajaongkir.com/starter/province?key=" +
        process.env.NEXT_PUBLIC_RAJA_ONGKIR_KEY,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    return NextResponse.json({
      success: true,
      message: "Berhasil mengambil data provinsi",
      province: data.rajaongkir.results,
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}
