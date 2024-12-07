import { ResponseError } from "@/lib/response-error";

import { NextRequest, NextResponse } from "next/server";

import ShippingAddress from "@/lib/models/adress-model";
import { verifyToken } from "@/lib/verify-token";

export async function POST(req: NextRequest) {
  const token = verifyToken(req, ["customer"]);
  try {
    if (token instanceof NextResponse) {
      return token;
    }

    const {
      userId,
      fullname,
      phone,
      address,
      province,
      city,
      subdistrict,
      postalCode,
    } = await req.json();

    const data = await ShippingAddress.find({ userId });

    if (data.length >= 3) {
      return ResponseError(400, "Maksimal 3 alamat pengiriman");
    }

    if (
      !userId ||
      !fullname ||
      !phone ||
      !address ||
      !province ||
      !city ||
      !subdistrict ||
      !postalCode
    ) {
      return ResponseError(400, "Data tidak boleh kosong");
    }

    const newAddress = new ShippingAddress({
      userId,
      fullname,
      phone,
      address,
      province,
      city,
      subdistrict,
      postalCode,
    });

    await newAddress.save();

    const getAdress = await ShippingAddress.find({ userId }).sort({
      createdAt: -1,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Alamat pengiriman telah ditambahkan",
        address: getAdress,
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
    const userId = new URL(req.url).searchParams.get("userId");

    const address = await ShippingAddress.find({ userId: userId }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      message: "Data berhasil diambil",
      address,
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}

export async function DELETE(req: NextRequest) {
  const token = verifyToken(req, ["customer"]);
  try {
    if (token instanceof NextResponse) {
      return token;
    }

    const params = new URL(req.url);
    const addressId = params.searchParams.get("addressId");
    const userId = params.searchParams.get("userId");

    if (!addressId || !userId) {
      return ResponseError(400, "Data tidak boleh kosong");
    }

    await ShippingAddress.deleteOne({ _id: addressId });

    const address = await ShippingAddress.find({ userId: userId }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      message: "Berhasil menghapus dari keranjang",
      address,
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}
