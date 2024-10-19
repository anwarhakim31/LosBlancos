import { ResponseError } from "@/lib/response-error";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const params = new URL(req.url).searchParams;

    const origin = params.get("origin");
    const destination = params.get("destination");
    const weight = params.get("weight");
    const volume = params.get("volume");

    const searchParams = new URLSearchParams();

    searchParams.set(
      "api_key",
      process.env.NEXT_PUBLIC_BINDERBYTE_KEY as string
    );
    searchParams.set("courier", "pos");
    searchParams.set("origin", origin as string);
    searchParams.set("destination", destination as string);
    searchParams.set("weight", weight as string);
    searchParams.set("volume", volume as string);

    const res = await fetch(
      "https://api.binderbyte.com/v1/cost?" + searchParams.toString()
    );

    if (res.status === 400) {
      return NextResponse.json({
        success: false,
        message: "ongkir tidak ditemukan di wilayah anda",
        costs: [],
      });
    }

    if (res.status === 500) {
      return NextResponse.json({
        success: false,
        message: "Sistem error, silahkan coba kembali",
        costs: [],
      });
    }

    const data = await res.json();

    const filterOngkir = data.data.costs.filter(
      (item: { service: string }) =>
        item.service === "Pos Nextday" ||
        item.service === "Pos Sameday" ||
        item.service === "Pos Reguler"
    );

    return NextResponse.json({
      success: true,
      message: "Berhasil mengambil tarif ongkir",
      costs: filterOngkir,
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}
