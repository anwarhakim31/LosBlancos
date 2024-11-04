import Transaction from "@/lib/models/transaction-model";
import { ResponseError } from "@/lib/response-error";
import { verifyTokenMember } from "@/lib/verify-token";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    verifyTokenMember(req);

    if (id && id.length !== 24) {
      return ResponseError(404, "Transaksi tidak ditemukan dengan ID tersebut");
    }

    const transaction = await Transaction.findOne({
      _id: id,
    })
      .populate({
        path: "items.productId",
        populate: {
          path: "collectionName",
        },
      })
      .populate("userId");

    if (!transaction) {
      return ResponseError(404, "Transaksi tidak ditemukan dengan ID tersebut");
    }
    const now = new Date().getTime();
    const expired = new Date(transaction.expired).getTime();
    const timeRemaining = expired - now;

    if (
      transaction.paymentStatus === "tertunda" &&
      transaction.transactionStatus === "tertunda" &&
      timeRemaining < 0
    ) {
      await Transaction.findByIdAndDelete(id);
      return ResponseError(404, "Transaksi tidak ditemukan dengan ID tersebut");
    }

    return NextResponse.json({
      success: true,
      message: "Data berhasil diambil",
      transaction,
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}
