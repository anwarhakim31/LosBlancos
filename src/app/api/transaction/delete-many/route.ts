import Transaction from "@/lib/models/transaction-model";
import { ResponseError } from "@/lib/response-error";
import { verifyTokenMember } from "@/lib/verify-token";

import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    verifyTokenMember(req);

    const body = await req.json();

    await Transaction.deleteMany({
      _id: { $in: body },
    });

    return NextResponse.json({
      success: true,
      message: "Transaksi berhasil dihapus",
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal server error");
  }
}
