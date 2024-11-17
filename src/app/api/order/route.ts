import connectDB from "@/lib/db";
import Transaction from "@/lib/models/transaction-model";
import { ResponseError } from "@/lib/response-error";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const userId = searchParams.get("user");
    const statusPayment = searchParams.get("payment");
    const statusTransaction = searchParams.get("transaction");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "8");
    const skip = (page - 1) * limit;

    const now = new Date();

    await Transaction.deleteMany({
      userId,
      paymentStatus: "tertunda",
      transactionStatus: "tertunda",
      expired: { $lt: now },
    });

    const filter: {
      userId: string;
      transactionStatus: string;
      paymentStatus?: string;
    } = {
      userId: userId as string,
      transactionStatus: statusTransaction as string,
    };

    if (statusPayment) {
      filter.paymentStatus = statusPayment as string;
    }

    const transaction = await Transaction.find(filter)
      .populate("items.productId")
      .skip(skip)
      .limit(limit)
      .sort({ updatedAt: -1 });

    const total = await Transaction.countDocuments(filter);

    return NextResponse.json({
      success: true,
      message: "Data berhasil diambil",
      transaction,
      pagination: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { order_id } = await req.json();

    const transaction = await Transaction.findByIdAndUpdate(
      { _id: order_id },
      {
        $set: {
          transactionStatus: "selesai",
        },
      }
    );

    if (!transaction) {
      return NextResponse.json(
        {
          success: false,
          message: "Transaction not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "transaction selesai",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const id = searchParams.get("id");

    const data = await Transaction.findByIdAndDelete(id);

    if (!data) {
      return ResponseError(404, "Transaksi tidak ditemukan");
    }

    return NextResponse.json({
      status: "success",
      message: "Transaksi berhasil dibatalkan",
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal server error");
  }
}
