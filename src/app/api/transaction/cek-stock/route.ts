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

    let diffrent = false;

    for (const item of transaction.items) {
      const stockDB = await Stock.findOne({
        productId: item.productId,
        attribute: item.atribute,
        value: item.atributeValue,
      }).populate("productId");

      if (item.quantity > stockDB.stock) {
        diffrent = true;
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
