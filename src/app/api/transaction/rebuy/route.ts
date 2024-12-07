import Stock from "@/lib/models/stock-model";
import { ResponseError } from "@/lib/response-error";
import { v4 as uuid } from "uuid";
import { NextRequest, NextResponse } from "next/server";
import Transaction from "@/lib/models/transaction-model";
import { verifyToken } from "@/lib/verify-token";

export async function POST(req: NextRequest) {
  const token = verifyToken(req, ["customer"]);
  try {
    let userId = "";

    if (token && typeof token === "object" && "id" in token) {
      userId = token.id;
    }

    const order_id = req.nextUrl.searchParams.get("order_id");

    const transactionOld = await Transaction.findOne({
      invoice: order_id,
    }).populate("items.productId");

    const newItem = [];

    for (const item of transactionOld.items) {
      const stockDB = await Stock.findOne({
        productId: item.productId,
        attribute: item.atribute,
        value: item.atributeValue,
      }).populate("productId");

      if (stockDB.stock === 0) {
        continue;
      } else if (item.quantity > stockDB.stock) {
        newItem.push({
          productId: item.productId._id,
          atribute: item.atribute,
          atributeValue: item.atributeValue,
          quantity: stockDB.stock,
          price: item.productId.price * stockDB.stock,
          weight: item.weight * stockDB.stock,
        });
      } else {
        newItem.push({
          productId: item.productId._id,
          atribute: item.atribute,
          atributeValue: item.atributeValue,
          quantity: item.quantity,
          price: item.price,
          weight: item.weight * item.quantity,
        });
      }
    }

    const total = newItem.reduce((acc, item) => {
      return acc + item.price;
    }, 0);

    const previx = "INV";
    const Segment = uuid().split("-")[0].toLocaleUpperCase();

    const invoice = `${previx}-${Segment}`;

    const transaction = new Transaction({
      invoice,
      userId,
      items: newItem,
      subTotal: total,
      shippingCost: 0,
      totalPayment: total,
      paymnetStatus: "tertunda",
      transactionStatus: "tertunda",
      expired: new Date(new Date().getTime() + 8 * 60 * 60 * 1000),
    });

    await transaction.save();

    return NextResponse.json({
      success: true,
      message: "Berhasil menambahkan transaksi",
      transaction: transaction._id,
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}
