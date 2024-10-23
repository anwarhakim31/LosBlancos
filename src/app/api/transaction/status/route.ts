import Stock from "@/lib/models/stock-model";
import Transaction from "@/lib/models/transaction-model";
import { ResponseError } from "@/lib/response-error";
import { verifyTokenMember } from "@/lib/verify-token";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    verifyTokenMember(req);

    const params = req.nextUrl.searchParams;

    const order_id = params.get("order_id");

    const transaction = await Transaction.findOne({
      invoice: order_id,
    });

    if (!transaction) {
      return ResponseError(404, "Transaksi tidak ditemukan");
    }

    const expired = new Date(transaction.paymentExpired).getTime();
    const now = new Date().getTime();

    const timeRemaining = expired - now;

    if (timeRemaining < 0) {
      if (transaction.paymentStatus === "tertunda") {
        console.log(true);
        for (const item of transaction.items) {
          await Stock.findOneAndUpdate(
            {
              productId: item.productId,
              attribute: item.atribute,
              value: item.atributeValue,
            },
            {
              $inc: {
                stock: item.quantity,
              },
            }
          );
        }
      }

      transaction.paymentStatus = "kadaluwarsa";
      transaction.transactionStatus = "dibatalkan";

      await transaction.save();
    }

    const data = {
      transactionStatus: transaction.transactionStatus,
      paymentStatus: transaction.paymentStatus,
    };

    return NextResponse.json({
      success: true,
      message: "Data berhasil diambil",
      data,
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal server error");
  }
}
