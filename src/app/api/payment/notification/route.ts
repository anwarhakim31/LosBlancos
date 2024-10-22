import connectDB from "@/lib/db";
import Transaction from "@/lib/models/transaction-model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const { transaction_status, order_id } = body;

    console.log(transaction_status, order_id, body);

    const transaction = await Transaction.findOne({ invoice: order_id });

    if (!transaction) {
      return NextResponse.json(
        { message: "Transaksi tidak ditemukan" },
        { status: 404 }
      );
    }

    if (transaction_status === "settlement") {
      transaction.paymentStatus = "settlement";
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "expire"
    ) {
      transaction.paymentStatus = "cancel";
    } else if (transaction_status === "pending") {
      transaction.paymentStatus = "pending";
    }

    await transaction.save();

    return NextResponse.json(
      { message: "Status transaksi berhasil diperbarui", data: body },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
