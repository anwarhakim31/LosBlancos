import { ResponseError } from "@/lib/response-error";

import { NextRequest, NextResponse } from "next/server";

import ShippingAddress from "@/lib/models/adress-model";

export async function POST(req: NextRequest) {
  try {
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

    return NextResponse.json(
      {
        success: true,
        message: "Alamat pengiriman telah ditambahkan",
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

    const address = await ShippingAddress.find({ userId: userId });

    return NextResponse.json({
      success: true,
      message: "Data berhasil diambil",
      address,
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}

// export async function DELETE(req: NextRequest) {
//   try {
//     const { userId, itemId } = await req.json();

//     if (!userId || !itemId) {
//       return ResponseError(400, "Data tidak boleh kosong");
//     }

//     const cart = await Cart.findOne({ userId });

//     if (!cart) {
//       return ResponseError(404, "Keranjang tidak ditemukan");
//     }

//     cart.items = cart.items.filter(
//       (item: CartItem) => item._id.toString() !== itemId
//     );

//     await cart.save();

//     const updateCart = await Cart.findOne({ userId }).populate({
//       path: "items.product",
//       populate: {
//         path: "collectionName",
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Berhasil menghapus dari keranjang",
//       cart: updateCart,
//     });
//   } catch (error) {
//     console.log(error);
//     return ResponseError(500, "Internal Server Error");
//   }
// }
