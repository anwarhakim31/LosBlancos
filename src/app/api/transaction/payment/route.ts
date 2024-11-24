/* eslint-disable @typescript-eslint/no-explicit-any */
import Stock from "@/lib/models/stock-model";
import Transaction from "@/lib/models/transaction-model";
import { ResponseError } from "@/lib/response-error";

import {
  itemTypeTransaction,
  TypeShippingAddress,
} from "@/services/type.module";
import { formatDateToMidtrans } from "@/utils/contant";
import { NextRequest, NextResponse } from "next/server";

const MIDTRANS_BASE_URL = process.env.MIDTRANS_BASE_URL;
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SECRET_SERVER_KEY;

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

function payload(
  payment: string,
  orderId: string,
  customerDetails: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  },
  grossAmount: number
) {
  switch (payment) {
    case "mandiri bill":
      return {
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
          expiry_duration: 60,
          unit: "minute",
        },
      };
    case "alfamart":
      return {
        payment_type: "cstore",
        transaction_details: {
          order_id: orderId,
          gross_amount: grossAmount,
        },
        cstore: {
          store: "alfamart",
          message: "Payment from Alfamart",
        },
        custom_expiry: {
          order_time: formatDateToMidtrans(),
          expiry_duration: 60,
          unit: "minute",
        },
      };
    case "indomaret":
      return {
        payment_type: "cstore",
        transaction_details: {
          order_id: orderId,
          gross_amount: grossAmount,
        },
        cstore: {
          store: "indomaret",
          message: "Payment from indomaret",
        },
        custom_expiry: {
          order_time: formatDateToMidtrans(),
          expiry_duration: 60,
          unit: "minute",
        },
      };
    default:
      return {
        payment_type: "bank_transfer",
        transaction_details: {
          order_id: orderId,
          gross_amount: grossAmount,
        },
        bank_transfer: {
          bank: payment,
        },
        customer_details: customerDetails,
        custom_expiry: {
          order_time: formatDateToMidtrans(),
          expiry_duration: 60,
          unit: "minute",
        },
      };
  }
}

function paymentCode(payment: string, data: any) {
  switch (payment) {
    case "mandiri bill":
      return `${data.biller_code} ${data.bill_key}`;
    case "alfamart":
      return data.payment_code;
    case "indomaret":
      return data.payment_code;
    default:
      return data?.va_numbers[0].va_number;
  }
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();

    const { shipping, payment, transaction_id, shippingAddress } = json;

    if (!shipping || !payment || !transaction_id || !shippingAddress) {
      return ResponseError(404, "Missing required fields");
    }

    if (
      payment &&
      !Bank_Available.includes(payment) &&
      !Counter_Available.includes(payment)
    ) {
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
    const customerDetails = {
      first_name: shippingAddress.fullname,
      last_name: "-",
      email: shippingAddress.email,
      phone: shippingAddress.phone,
    };

    const res = await fetch((MIDTRANS_BASE_URL as string) + "/charge", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: getAuthHeader(),
      },
      body: JSON.stringify(
        payload(payment, orderId, customerDetails, grossAmount)
      ),
    });
    const data = await res.json();

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

    transaction.expired = data.expiry_time;
    transaction.shippingAddress = address(shippingAddress);
    transaction.shippingCost = shipping.cost[0].value;
    transaction.shippingName = shippingName;
    transaction.paymentMethod = payment_method(payment);
    transaction.paymentStatus = "tertunda";
    transaction.paymentCode = paymentCode(payment, data);
    transaction.totalPayment = grossAmount;
    transaction.paymentName = payment;
    transaction.paymentId = data.transaction_id;
    transaction.paymentCreated = data.transaction_time;
    transaction.paymentExpired = data.expiry_time;

    console.log("estimated", shipping.cost[0].etd);

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

export async function PUT(req: NextRequest) {
  try {
    const json = await req.json();

    const { shipping, payment, transaction_id, shippingAddress } = json;

    if (!shipping || !payment || !transaction_id || !shippingAddress) {
      return ResponseError(404, "Missing required fields");
    }

    if (
      payment &&
      !Bank_Available.includes(payment) &&
      !Counter_Available.includes(payment)
    ) {
      return ResponseError(404, "Metode pembayaran tidak tersedia");
    }

    const transaction = await Transaction.findById({
      _id: transaction_id,
    }).populate("items.productId");

    if (!transaction) {
      return ResponseError(404, "Transaksi tidak ditemukan");
    }

    if (transaction.paymentStatus === "dibayar") {
      return ResponseError(404, "Transaksi sudah lunas");
    }

    if (transaction.transactionStatus !== "tertunda") {
      return ResponseError(404, "Transaksi sedang diproses");
    }

    for (const item of transaction.items) {
      const stockDB = await Stock.findOne({
        productId: item.productId,
        attribute: item.atribute,
        value: item.atributeValue,
      }).populate("productId");

      if (!stockDB) {
        transaction.items = transaction.filter(
          (t: itemTypeTransaction) => t._id !== item._id
        );
      }

      if (stockDB.stock === 0) {
        transaction.items = transaction.filter(
          (t: itemTypeTransaction) => t._id !== item._id
        );
      }

      if (item.quantity > stockDB.stock && stockDB.stock > 0) {
        item.quantity = stockDB.stock;
        item.price = item.quantity * item.price;
        item.weight = item.quantity * item.productId.weight;
      }
    }

    await transaction.save();

    let grossAmount = transaction.subtotal + shipping.cost[0].value + 1000;

    if (transaction.diskon > 0) {
      grossAmount -= transaction.diskon;
    }

    const shippingName = `${shipping.courier} - ${shipping.service}`;

    const orderId = transaction.invoice;
    const customerDetails = {
      first_name: shippingAddress.fullname,
      last_name: "-",
      email: shippingAddress.email,
      phone: shippingAddress.phone,
    };

    const res = await fetch((MIDTRANS_BASE_URL as string) + "/charge", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: getAuthHeader(),
      },
      body: JSON.stringify(
        payload(payment, orderId, customerDetails, grossAmount)
      ),
    });
    const data = await res.json();

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

    transaction.expired = data.expiry_time;
    transaction.shippingAddress = address(shippingAddress);
    transaction.shippingCost = shipping.cost[0].value;
    transaction.shippingName = shippingName;
    transaction.paymentMethod = payment_method(payment);
    transaction.paymentStatus = "tertunda";
    transaction.paymentCode = paymentCode(payment, data);
    transaction.totalPayment = grossAmount;
    transaction.paymentName = payment;
    transaction.paymentId = data.transaction_id;
    transaction.paymentCreated = data.transaction_time;
    transaction.paymentExpired = data.expiry_time;
    transaction.estimated = shipping.cost[0].etd;

    console.log("estimated", shipping.cost[0].etd);

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
