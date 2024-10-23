import connectDB from "@/lib/db";
import Transaction from "@/lib/models/transaction-model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { transaction_status, order_id } = body;

    const transaction = await Transaction.findOne({ invoice: order_id });

    if (!transaction) {
      return NextResponse.json(
        { message: "Transaksi tidak ditemukan" },
        { status: 404 }
      );
    }

    if (
      transaction.paymentStatus === "tertunda" &&
      transaction_status === "cancel"
    ) {
      transaction.paymentStatus = "tertunda";
      await transaction.save();
      return NextResponse.json(
        { message: "Status transaksi berhasil diperbarui" },
        { status: 200 }
      );
    }

    const statusMap = {
      settlement: "dibayar",
      expire: "kadaluawarsa",
      pending: "tertunda",
      deny: "ditolak",
      cancel: "dibatalkan",
    };

    transaction.paymentStatus =
      statusMap[transaction_status as keyof typeof statusMap] ||
      transaction.paymentStatus;
    await transaction.save();

    return NextResponse.json(
      { message: "Status transaksi berhasil diperbarui  " },
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
