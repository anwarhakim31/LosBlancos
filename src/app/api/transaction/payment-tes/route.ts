import { ResponseError } from "@/lib/response-error";
import { verifyTokenMember } from "@/lib/verify-token";

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
    verifyTokenMember(req);

    const res = await fetch((MIDTRANS_BASE_URL as string) + "/charge", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: getAuthHeader(),
      },
      body: JSON.stringify({
        payment_type: "gopay",
        transaction_details: {
          order_id: "order-id-123412115",
          gross_amount: 10000,
        },
      }),
    });
    const data = await res.json();

    return NextResponse.json({
      status: "success",
      data,
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, (error as Error).message);
  }
}
