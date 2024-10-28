import connectDB from "@/lib/db";
import Product from "@/lib/models/product-model";
import Stock from "@/lib/models/stock-model";
import Transaction from "@/lib/models/transaction-model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { transaction_status } = body;

    const transaction = await Transaction.findOne({ invoice: body.order_id });

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
      const updated = await transaction.save();

      const updates = updated.items.map(
        (item: {
          quantity: number;
          productId: string;
          atribute: string;
          atributeValue: string;
        }) => ({
          updateOne: {
            filter: {
              productId: item.productId,
              attribute: item.atribute,
              value: item.atributeValue,
            },
            update: {
              $inc: { stock: item.quantity },
            },
          },
        })
      );

      await Stock.bulkWrite(updates);
      return NextResponse.json(
        { message: "Status transaksi berhasil diperbarui" },
        { status: 200 }
      );
    }

    const statusMap = {
      settlement: "dibayar",
      expire: "kadaluwarsa",
      pending: "tertunda",
      deny: "ditolak",
      cancel: "dibatalkan",
    };

    transaction.paymentStatus =
      statusMap[transaction_status as keyof typeof statusMap];

    if (transaction.paymentStatus === "dibayar") {
      for (const item of transaction.items) {
        await Product.findOneAndUpdate(
          { _id: item.productId },
          { $inc: { sold: item.quantity } }
        );
      }
    }

    if (
      transaction.paymentStatus === "dibatalkan" ||
      transaction.paymentStatus === "ditolak" ||
      transaction.paymentStatus === "kadaluwarsa"
    ) {
      transaction.transactionStatus = "dibatalkan";
    }

    const transactionUpdated = await transaction.save();

    if (
      transactionUpdated.paymentStatus !== "tertunda" &&
      transactionUpdated.paymentStatus !== "dibayar"
    ) {
      const updates = transactionUpdated.items.map(
        (item: {
          quantity: number;
          productId: string;
          atribute: string;
          atributeValue: string;
        }) => ({
          updateOne: {
            filter: {
              productId: item.productId,
              attribute: item.atribute,
              value: item.atributeValue,
            },
            update: {
              $inc: { stock: item.quantity },
            },
          },
        })
      );

      await Stock.bulkWrite(updates);
    }

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
