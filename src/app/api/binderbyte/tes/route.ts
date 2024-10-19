import { ResponseError } from "@/lib/response-error";
import { NextResponse } from "next/server";

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

export async function GET() {
  try {
    const key = "ae3be4fdc283180a41cdb74494fe79d3";

    const resProvinsi = await fetch(
      "https://api.rajaongkir.com/starter/city?key=" + key
    );

    const province = await resProvinsi.json();

    const city_id_origin = province.rajaongkir.results.filter(
      (item: { province: "string"; city_name: string }) =>
        item.province
          .toLocaleLowerCase()
          .includes(provinceFilter("jawa barat")) &&
        item.city_name.toLocaleLowerCase().includes(cityFilter("kab. bekasi"))
    )[0].city_id;

    const city_id_destination = province.rajaongkir.results.filter(
      (item: { province: "string"; city_name: string }) =>
        item.province.toLocaleLowerCase().includes("jawa barat") &&
        item.city_name.toLocaleLowerCase().includes(cityFilter("kota bekasi"))
    )[0].city_id;

    console.log(city_id_origin, city_id_destination);

    const resJNE = await fetch("https://api.rajaongkir.com/starter/cost", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        key,
      },
      body: JSON.stringify({
        origin: city_id_origin,
        destination: city_id_destination,
        weight: "1000",
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
        weight: "1000",
        courier: "pos",
      }),
    });

    const data1 = await resJNE.json();
    const data2 = await resPOS.json();

    const jne = data1.rajaongkir.results[0].costs
      .filter((item: { service: string }) => item.service !== "JTR")
      .map((item: { service: string; cost: { value: string } }) => ({
        ...item,
        courier: "jne",
      }));

    const pos = data2.rajaongkir.results[0].costs.map(
      (item: { service: string; cost: { value: string } }) => ({
        ...item,
        courier: "pos",
      })
    );

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
