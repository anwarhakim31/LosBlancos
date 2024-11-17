import connectDB from "@/lib/db";
import Notification from "@/lib/models/notification-model";
import Product from "@/lib/models/product-model";
import Statistic from "@/lib/models/statistic-model";
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
      transaction.transactionStatus = "diproses";

      await Notification.findOneAndUpdate(
        {
          dataId: transaction._id,
        },
        {
          $set: {
            dataId: transaction._id,
            title: "Pesanan Baru",
            description: `Pesanan ${transaction.invoice} telah dibayar`,
          },
        },
        {
          upsert: true,
        }
      );

      const stock = await Stock.find({
        $or: [
          {
            stock: 0,
          },
          {
            productId: {
              $in: transaction.items.map(
                (item: { productId: string }) => item.productId
              ),
            },
          },
        ],
      });

      if (stock.length > 0) {
        for (const item of stock) {
          const notifStock = new Notification({
            title: "Stok Habis",
            dataId: item.productId,
            description: `Stok ${item.productId} telah habis`,
          });

          await notifStock.save();
        }
      }

      for (const item of transaction.items) {
        await Product.findOneAndUpdate(
          { _id: item.productId },
          { $inc: { sold: item.quantity } }
        );
      }

      await Statistic.findOneAndUpdate(
        {},
        {
          $inc: {
            product: transaction.items.reduce(
              (acc: number, item: { quantity: number }) => acc + item.quantity,
              0
            ),
            transaction: 1,
            income: transaction.subtotal + 1000 - transaction.diskon,
          },
        },
        {
          upsert: true,
        }
      );

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SOCKET_URL}/api/notification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: transaction.invoice,
          }),
        }
      );

      if (!res.ok) {
        return NextResponse.json(
          { message: "Gagal mengirim notifikasi" },
          { status: 500 }
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
