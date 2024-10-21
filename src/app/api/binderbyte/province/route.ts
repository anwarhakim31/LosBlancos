import { ResponseError } from "@/lib/response-error";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.binderbyte.com/wilayah/provinsi?api_key=" +
        process.env.BINDERBYTE_KEY,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      return NextResponse.json({
        success: false,
        message: "Error fetching data",
        provinsi: [],
      });
    }
    const data = await res.json();

    const remap = data?.value?.map((item: { id: number; name: string }) => ({
      id: item.id,
      provinsi: item.name.toLowerCase(),
    }));

    return NextResponse.json({
      success: true,
      message: "Berhasil mengambil data provinsi",
      provinsi: remap,
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}
