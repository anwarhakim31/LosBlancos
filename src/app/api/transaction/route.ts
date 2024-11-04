import Stock from "@/lib/models/stock-model";
import { ResponseError } from "@/lib/response-error";
import { v4 as uuid } from "uuid";
import { NextRequest, NextResponse } from "next/server";
import Transaction from "@/lib/models/transaction-model";
import Cart from "@/lib/models/cart-model";
import { verifyTokenMember } from "@/lib/verify-token";
import { itemCartType } from "@/services/type.module";

export async function POST(req: NextRequest) {
  try {
    verifyTokenMember(req);
    const { items, total, userId, cartId } = await req.json();

    if (!userId || !total || !items) {
      return ResponseError(400, "Data tidak boleh kosong");
    }

    for (const item of items) {
      const stockDB = await Stock.findOne({
        productId: item.product._id,
        attribute: item.atribute,
        value: item.atributeValue,
      }).populate("productId");

      if (stockDB?.stock === 0) {
        return ResponseError(
          400,
          `Gagal.${item.product.name} ${item.atribute} ${item.atributeValue}, stock sudah habis`
        );
      }

      if (item.quantity > stockDB.stock) {
        return ResponseError(
          400,
          `Gagal.${item.product.name} ${item.atribute} ${item.atributeValue}, stock yang tersedia tersisa ${stockDB.stock}`
        );
      }
    }

    const previx = "INV";
    const Segment = uuid().split("-")[0].toLocaleUpperCase();

    const invoice = `${previx}-${Segment}`;

    const newitem = items.map((item: itemCartType) => ({
      productId: item.product,
      atribute: item.atribute,
      atributeValue: item.atributeValue,
      quantity: item.quantity,
      price: item.price,
      weight: item.quantity * item.product.weight || 0,
    }));

    const transaction = new Transaction({
      invoice,
      userId,
      items: newitem,
      subTotal: total,
      shippingCost: 0,
      totalPayment: total,
      paymentStatus: "tertunda",
      transactionStatus: "tertunda",
      expired: new Date(new Date().getTime() + 8 * 60 * 60 * 1000),
    });

    await transaction.save();

    if (cartId) {
      await Cart.findOneAndDelete({ userId });
    }

    return NextResponse.json({
      success: true,
      message: "Berhasil menambahkan transaksi",
      id: transaction._id,
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}

export async function GET(req: NextRequest) {
  try {
    verifyTokenMember(req);

    const { searchParams } = req.nextUrl;

    const transactionId = searchParams.get("transactionId");

    if (transactionId && transactionId.length !== 24) {
      return ResponseError(404, "Transaksi tidak ditemukan dengan ID tersebut");
    }

    const transaction = await Transaction.findOne({
      _id: transactionId,
    }).populate({
      path: "items.productId",
      populate: {
        path: "collectionName",
      },
    });

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
      await Transaction.findByIdAndDelete(transactionId);
      return ResponseError(404, "Transaksi tidak ditemukan dengan ID tersebut");
    }

    return NextResponse.json({
      success: true,
      message: "Data berhasil diambil",
      transaction,
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    verifyTokenMember(req);

    const { searchParams } = req.nextUrl;

    const transactionId = searchParams.get("transactionId");

    if (transactionId && transactionId.length !== 24) {
      return ResponseError(404, "Transaksi tidak ditemukan dengan ID tersebut");
    }

    const transaction = await Transaction.findByIdAndDelete(transactionId);

    if (!transaction) {
      return ResponseError(404, "Transaksi tidak ditemukan dengan ID tersebut");
    }

    return NextResponse.json({
      success: true,
      message: "Berhasil menghapus transaksi",
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}
