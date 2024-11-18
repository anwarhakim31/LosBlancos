/* eslint-disable @typescript-eslint/no-explicit-any */
import Ewallet from "@/lib/models/ewallet-model";
import Stock from "@/lib/models/stock-model";
import Transaction from "@/lib/models/transaction-model";
import { ResponseError } from "@/lib/response-error";
import { verifyTokenMember } from "@/lib/verify-token";
import { TypeShippingAddress } from "@/services/type.module";
import { formatDateToMidtrans } from "@/utils/contant";
import { NextRequest, NextResponse } from "next/server";

const MIDTRANS_BASE_URL = process.env.MIDTRANS_BASE_URL;
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SECRET_SERVER_KEY;

const getAuthHeader = () => {
  return `Basic ${Buffer.from(MIDTRANS_SERVER_KEY as string).toString(
    "base64"
  )}`;
};

const payment_available = ["gopay", "shopeepay", "qris"];

function address(shippingAdress: TypeShippingAddress) {
  return {
    fullname: shippingAdress.fullname,
    phone: shippingAdress.phone,
    address: shippingAdress.address,
    city: shippingAdress.city.name,
    province: shippingAdress.province.name,
    postal_code: shippingAdress.postalCode,
    subdistrict: shippingAdress.subdistrict,
    postalCode: shippingAdress.postalCode,
  };
}

function payload(payment: string, orderId: string, grossAmount: number) {
  switch (payment) {
    case "shopeepay":
      return {
        payment_type: "shopeepay",
        transaction_details: {
          order_id: orderId,
          gross_amount: grossAmount,
        },

        custom_expiry: {
          order_time: formatDateToMidtrans(),
          expiry_duration: 60,
          unit: "minute",
        },
        shopeepay: {
          callback_url: "https://midtrans.com/",
        },
      };
    case "gopay":
      return {
        payment_type: "gopay",
        transaction_details: {
          order_id: orderId,
          gross_amount: grossAmount,
        },
        custom_expiry: {
          order_time: formatDateToMidtrans(),
          expiry_duration: 60,
          unit: "minute",
        },
      };

    default:
      return {
        payment_type: "qris",
        transaction_details: {
          order_id: orderId,
          gross_amount: grossAmount,
        },
        custom_expiry: {
          order_time: formatDateToMidtrans(),
          expiry_duration: 60,
          unit: "minute",
        },
      };
  }
}

export async function POST(req: NextRequest) {
  try {
    verifyTokenMember(req);

    const json = await req.json();

    const { shipping, payment, transaction_id, shippingAddress } = json;

    if (!shipping || !payment || !transaction_id || !shippingAddress) {
      return ResponseError(404, "Missing required fields");
    }

    if (payment && !payment_available.includes(payment)) {
      return ResponseError(404, "Metode pembayaran tidak tersedia");
    }

    const transaction = await Transaction.findById({
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

    const diffrent: string[] = [];

    for (const item of transaction.items) {
      const stockDB = await Stock.findOne({
        productId: item.productId,
        attribute: item.atribute,
        value: item.atributeValue,
      }).populate("productId");

      if (!stockDB) {
        diffrent.push(
          `${stockDB.productId.name} ${item.atribute} ${item.atributeValue} produk sudah tidak ada`
        );
      }

      if (stockDB.stock === 0) {
        diffrent.push(
          `${stockDB.productId.name} ${item.atribute} ${item.atributeValue} sudah habis`
        );
      }

      if (item.quantity > stockDB.stock && stockDB.stock > 0) {
        diffrent.push(
          `${stockDB.productId.name} ${item.atribute} ${item.atributeValue} stock yang tersedia tersisa ${stockDB.stock}`
        );
      }
    }

    if (diffrent.length > 0) {
      return NextResponse.json({
        success: true,
        message: "Berhasil cek stock",
        diffrent,
      });
    }

    let grossAmount = transaction.subtotal + shipping.cost[0].value + 1000;

    if (transaction.diskon > 0) {
      grossAmount -= transaction.diskon;
    }

    const shippingName = `${shipping.courier} - ${shipping.service}`;

    const orderId = transaction.invoice;

    const res = await fetch((MIDTRANS_BASE_URL as string) + "/charge", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: getAuthHeader(),
      },
      body: JSON.stringify(payload(payment, orderId, grossAmount)),
    });
    const data = await res.json();

    console.log(data);

    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Gagal melakukan pembayaran",
          data: data,
          res: payload,
        },
        {
          status: 500,
        }
      );
    }

    const actionEwallet = new Ewallet({
      transactionId: transaction_id,
      actions: data?.actions,
    });

    const ewallet = await actionEwallet.save();

    transaction.expired = data.expiry_time;
    transaction.shippingAddress = address(shippingAddress);
    transaction.shippingCost = shipping.cost[0].value;
    transaction.shippingName = shippingName;
    transaction.totalPayment = grossAmount;
    transaction.paymentMethod = "e-wallet";
    transaction.paymentStatus = "tertunda";
    transaction.paymentCode = ewallet._id;
    transaction.paymentName = payment;
    transaction.paymentId = data.transaction_id;
    transaction.paymentCreated = data.transaction_time;
    transaction.paymentExpired = data.expiry_time;

    const saveTransaction = await transaction.save();

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
      transaction: saveTransaction,
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, (error as Error).message);
  }
}
