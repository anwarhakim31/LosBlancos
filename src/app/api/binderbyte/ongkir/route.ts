import { ResponseError } from "@/lib/response-error";
import { NextRequest, NextResponse } from "next/server";

function provinceFilter(province: string) {
  return province.toLocaleLowerCase();
}
function cityFilter(city: string) {
  let formattedCity = city.toLocaleLowerCase();
  if (formattedCity.startsWith("kota ")) {
    formattedCity = formattedCity
      .split("kota ")
      .filter((item: string) => item)
      .toString();
  } else if (formattedCity.startsWith("kab. ")) {
    formattedCity = formattedCity
      .split("kab. ")
      .filter((item: string) => item)
      .toString();
  }
  return formattedCity;
}

export async function GET(req: NextRequest) {
  try {
    const params = new URL(req.url).searchParams;

    // const origin = params.get("origin");
    const desProvince = params.get("desProvince") || "";
    const desCity = params.get("desCity") || "";
    const weight = params.get("weight");

    const key = process.env.NEXT_PUBLIC_RAJAONGKIR_KEY as string;

    console.log(desProvince, desCity, weight);

    const resProvinsi = await fetch(
      "https://api.rajaongkir.com/starter/city?key=" + key
    );

    if (!resProvinsi.ok) {
      return NextResponse.json({
        success: false,
        message: "ongkir tidak ditemukan di wilayah anda",
        costs: [],
      });
    }

    const province = await resProvinsi.json();

    const city_id_origin = province.rajaongkir.results.filter(
      (item: { province: "string"; city_name: string }) =>
        item.province
          .toLocaleLowerCase()
          .includes(provinceFilter("jawa barat")) &&
        item.city_name.toLocaleLowerCase().includes(cityFilter("depok"))
    )[0].city_id;

    const city_id_destination = province.rajaongkir.results.filter(
      (item: { province: "string"; city_name: string }) =>
        item.province.toLocaleLowerCase().includes(desProvince) &&
        item.city_name.toLocaleLowerCase().includes(cityFilter(desCity))
    )[0].city_id;

    const resJNE = await fetch("https://api.rajaongkir.com/starter/cost", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        key,
      },
      body: JSON.stringify({
        origin: city_id_origin,
        destination: city_id_destination,
        weight,
        courier: "jne",
      }),
    });

    const resPOS = await fetch("https://api.rajaongkir.com/starter/cost", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        key,
      },
      body: JSON.stringify({
        origin: city_id_origin,
        destination: city_id_destination,
        weight,
        courier: "pos",
      }),
    });

    const data1 = await resJNE.json();
    const data2 = await resPOS.json();

    const jne = data1.rajaongkir.results[0].costs
      .filter((item: { service: string }) => item.service !== "JTR")
      .map((item: { service: string; cost: { value: string } }) => ({
        ...item,
        courier: "JNE",
      }));

    const pos = data2.rajaongkir.results[0].costs
      .filter((item: { service: string; value: string }) => {
        return (
          item.service === "Pos Sameday" ||
          item.service === "Pos Nextday" ||
          item.service === "Pos Reguler"
        );
      })
      .map((item: { service: string; cost: { value: string } }) => ({
        ...item,
        courier: "Pos Indonesia",
      }));

    return NextResponse.json({
      success: true,
      message: "Berhasil mengambil tarif ongkir",
      costs: [...jne, ...pos],
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}
