import Transaction from "@/lib/models/transaction-model";
import { ResponseError } from "@/lib/response-error";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "8");
    const search = searchParams.get("search")?.toString() || "";
    const skip = (page - 1) * limit;

    const searchRegex = new RegExp(search.trim(), "i");

    const filterQuery = {
      $or: [{ invoice: { $regex: searchRegex } }],
    };

    const transaction = await Transaction.find(filterQuery)
      .skip(skip)
      .limit(limit)
      .sort({ transactionDate: -1 })
      .populate("userId")
      .exec();

    const total = await Transaction.countDocuments(filterQuery);

    return NextResponse.json({
      status: 200,
      success: true,
      transaction,
      pagination: {
        page: page,
        limit: limit,
        total: total,
        totalPage: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}
