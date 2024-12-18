import Transaction from "@/lib/models/transaction-model";
import { ResponseError } from "@/lib/response-error";

import { NextRequest, NextResponse } from "next/server";

const MIDTRANS_BASE_URL = process.env.MIDTRANS_BASE_URL;
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SECRET_SERVER_KEY;

const getAuthHeader = () => {
  return `Basic ${Buffer.from(MIDTRANS_SERVER_KEY as string).toString(
    "base64"
  )}`;
};

export async function POST(req: NextRequest) {
  try {
    const { order_id } = await req.json();

    const isExist = await Transaction.findOne({
      invoice: order_id,
    });

    if (!isExist) {
      return ResponseError(404, "Transaksi tidak ditemukan");
    }

    const res = await fetch(`${MIDTRANS_BASE_URL}/${order_id}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: getAuthHeader(),
      },
    });
    const data = await res.json();

    if (data.status_code === "200") {
      const transaction = await Transaction.findOneAndUpdate(
        {
          invoice: order_id,
        },
        {
          $set: {
            paymentStatus: "tertunda",
            totalPayment: isExist.subtotal + 1000,
            expired: new Date(new Date().getTime() + 1000 * 60 * 60 * 8),
          },
          $unset: {
            paymentMethod: 1,
            paymentName: 1,
            paymentCode: 1,
            paymentCreated: 1,
            paymentExpired: 1,
            shippingCost: 1,
            shippingName: 1,
          },
        }
      ).select("_id items paymentStatus");

      return NextResponse.json({
        status: "success",
        transaction: transaction?._id,
      });
    } else {
      return ResponseError(400, data.status_message);
    }
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal server error");
  }
}
