import Stock from "@/lib/models/stock-model";
import Transaction from "@/lib/models/transaction-model";
import { ResponseError } from "@/lib/response-error";
import { verifyTokenMember } from "@/lib/verify-token";
import { formatDateToMidtrans } from "@/utils/contant";
import { NextRequest, NextResponse } from "next/server";

const MIDTRANS_BASE_URL = process.env.MIDTRANS_BASE_URL;
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SECRET_KEY;

const getAuthHeader = () => {
  return `Basic ${Buffer.from(MIDTRANS_SERVER_KEY as string).toString(
    "base64"
  )}`;
};

const Bank_Available = ["mandiri bill", "bca", "bni", "bri"];
const Counter_Available = ["indomaret", "alfamart"];

function payment_method(bank: string) {
  if (Bank_Available.includes(bank)) {
    return "bank_transfer";
  } else if (Counter_Available.includes(bank)) {
    return "over the counter";
  }
}

export async function POST(req: NextRequest) {
  try {
    verifyTokenMember(req);

    const json = await req.json();

    const { shippingCost, bank, transaction_id } = json;

    if (bank && !Bank_Available.includes(bank)) {
      return ResponseError(404, "Metode pembayaran tidak tersedia");
    }

    if (!transaction_id || !shippingCost || !bank) {
      return ResponseError(404, "Missing required fields");
    }

    const transaction = await Transaction.findOne({
      _id: transaction_id,
    });

    if (!transaction) {
      return ResponseError(404, "Transaksi tidak ditemukan");
    }

    if (transaction.paymentStatus === "dibayar") {
      return ResponseError(404, "Transaksi sudah lunas");
    }

    if (transaction.transactionStatus !== "tertunda") {
      return ResponseError(404, "Transaksi sedang diproses");
    }

    const grossAmount = transaction.subtotal + shippingCost + 1000;
    const orderId = transaction.invoice;
    const customerDetails = {
      first_name: "hakim",
      last_name: "hakim",
      email: "XrNpR@example.com",
      phone: "081234567890",
    };

    const payload =
      bank === "mandiri bill"
        ? {
            payment_type: "echannel",
            transaction_details: {
              order_id: orderId,
              gross_amount: grossAmount,
            },
            echannel: {
              bill_info1: "Payment:",
              bill_info2: "Online purchase",
            },
            customer_details: customerDetails,
            custom_expiry: {
              order_time: formatDateToMidtrans(),
              expiry_duration: 30,
              unit: "minute",
            },
          }
        : {
            payment_type: "bank_transfer",
            transaction_details: {
              order_id: orderId,
              gross_amount: grossAmount,
            },
            bank_transfer: {
              bank: bank,
            },
            customer_details: customerDetails,
            custom_expiry: {
              order_time: formatDateToMidtrans(),
              expiry_duration: 30,
              unit: "minute",
            },
          };

    const res = await fetch((MIDTRANS_BASE_URL as string) + "/charge", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: getAuthHeader(),
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: transaction_id },
      {
        shippingCost: shippingCost,
        totalPayment: grossAmount,
        payment_method: payment_method(bank),
        paymentCode:
          bank === "mandiri bill"
            ? `${data.biller_code} ${data.bill_key}`
            : data?.va_numbers[0].va_number,
        paymentName: bank,
        paymentId: data.transaction_id,
        paymentCreated: data.transaction_time,
        paymentExpired: data.expiry_time,
      },
      { new: true }
    ).select("_id items");

    for (const item of updatedTransaction.items) {
      const stockDB = await Stock.findOne({
        productId: item.productId,
        attribute: item.atribute,
        value: item.atributeValue,
      }).populate("productId");

      if (stockDB.stock <= 0) {
        await Transaction.deleteOne({ _id: transaction._id });

        return ResponseError(
          404,
          `Gagal. ${item.productId?.name} ${item.atribute} ${item.atributeValue}, stock sudah habis`
        );
      }

      if (item.quantity > stockDB.stock) {
        await Transaction.deleteOne({ _id: transaction._id });
        return ResponseError(
          400,
          `Gagal.${item.productId?.name} ${item.atribute} ${item.atributeValue}, stock tersisa kurang dari ${item.quantity}`
        );
      }
    }

    transaction.items.forEach(
      async (item: {
        productId: string;
        quantity: number;
        atribute: string;
        atributeValue: string;
      }) => {
        await Stock.findOneAndUpdate(
          {
            productId: item.productId,
            attribute: item.atribute,
            value: item.atributeValue,
          },
          { $inc: { stock: -item.quantity } },
          { new: true }
        );
      }
    );

    return NextResponse.json({
      status: "success",
      transaction: updatedTransaction,
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal server error");
  }
}
