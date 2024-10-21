import { ResponseError } from "@/lib/response-error";
import { NextRequest, NextResponse } from "next/server";

const MIDTRANS_BASE_URL = process.env.MIDTRANS_BASE_URL;
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SECRET_KEY;

const getAuthHeader = () => {
  return `Basic ${Buffer.from(MIDTRANS_SERVER_KEY as string).toString(
    "base64"
  )}`;
};

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();

    const { grossAmount, bank, customerDetails, orderId } = json;

    if (!orderId || !grossAmount || !bank || !customerDetails) {
      return ResponseError(400, "Missing required fields");
    }

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
          };

    const res = await fetch(MIDTRANS_BASE_URL as string, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: getAuthHeader(),
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    return NextResponse.json({
      status: "success",
      transaction: data,
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal server error");
  }
}
