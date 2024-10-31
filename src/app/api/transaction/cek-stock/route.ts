import Stock from "@/lib/models/stock-model";
import { ResponseError } from "@/lib/response-error";

import { NextRequest, NextResponse } from "next/server";
import Transaction from "@/lib/models/transaction-model";
import { verifyTokenMember } from "@/lib/verify-token";

export async function GET(req: NextRequest) {
  try {
    verifyTokenMember(req);
    const invoice = req.nextUrl.searchParams.get("order_id");

    const transaction = await Transaction.findOne({
      invoice,
    });

    const diffrent: string[] = [];

    for (const item of transaction.items) {
      const stockDB = await Stock.findOne({
        productId: item.productId,
        attribute: item.atribute,
        value: item.atributeValue,
      }).populate("productId");

      if (!stockDB) {
        diffrent.push(
          `${stockDB.productId.name} ${item.atribute} ${item.atributeValue} produk sudah tidak ada`
        );
      }

      if (stockDB.stock === 0) {
        diffrent.push(
          `${stockDB.productId.name} ${item.atribute} ${item.atributeValue} sudah habis`
        );
      }

      if (item.quantity > stockDB.stock && stockDB.stock > 0) {
        diffrent.push(
          `${stockDB.productId.name} ${item.atribute} ${item.atributeValue} stock yang tersedia tersisa ${stockDB.stock}`
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Berhasil mengambil status stock",
      diffrent,
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}
