import Transaction from "@/lib/models/transaction-model";
import { ResponseError } from "@/lib/response-error";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
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

export async function PUT(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const invoice = searchParams.get("invoice");
    const { transactionStatus, paymentStatus } = await req.json();

    const transaction = await Transaction.findOneAndUpdate(
      {
        invoice,
      },
      {
        $set: {
          transactionStatus,
          paymentStatus,
        },
      }
    );

    if (!transaction) {
      return ResponseError(404, "Transaksi tidak ditemukan");
    }

    return NextResponse.json({
      success: true,
      message: "Transaksi berhasil diperbarui",
    });
  } catch (error) {
    return ResponseError(500, "Internal server error");
  }
}
