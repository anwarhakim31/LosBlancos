import { ResponseError } from "@/lib/response-error";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const params = new URL(req.url).searchParams;

    const provinceId = params.get("province_id") || "";

    let data = { value: [] };

    if (provinceId) {
      const res = await fetch(
        "https://api.binderbyte.com/wilayah/kabupaten?api_key=" +
          process.env.NEXT_PUBLIC_BINDERBYTE_KEY +
          "&id_provinsi=" +
          provinceId,
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
          kota: [],
        });
      }

      data = await res.json();
    }

    const remap = data?.value?.map(
      (item: { id: number; id_provinsi: string; name: string }) => ({
        id: item.id,
        id_provinsi: item.id_provinsi,
        kota: item.name.toLowerCase(),
      })
    );

    return NextResponse.json({
      success: true,
      message: "Berhasil mengambil data kota",
      kota: remap,
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}
