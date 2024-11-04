import Transaction from "@/lib/models/transaction-model";
import { ResponseError } from "@/lib/response-error";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "8");
    const search = searchParams.get("search")?.toString() || "";
    const pStatus = searchParams.get("status-payment")?.toString() || "";
    const tStatus = searchParams.get("status-transaction")?.toString() || "";
    const date = searchParams.get("date")?.toString() || "";
    const skip = (page - 1) * limit;

    const searchRegex = new RegExp(search.trim(), "i");

    const filterQuery: {
      paymentStatus?: string;
      transactionStatus?: string;
      transactionDate?: { $gte: number | Date; $lte: number | Date };
      $or: { invoice: { $regex: RegExp } }[];
    } = {
      $or: [{ invoice: { $regex: searchRegex } }],
    };

    if (pStatus) {
      filterQuery.paymentStatus = pStatus;
    }
    if (tStatus) {
      filterQuery.transactionStatus = tStatus;
    }

    const now = new Date();
    const startDate = new Date(now.setHours(0, 0, 0, 0));
    const endDate = new Date(now.setHours(23, 59, 59, 999));

    if (date === "ini hari") {
      filterQuery.transactionDate = {
        $gte: startDate,
        $lte: endDate,
      };
    } else if (date === "3 hari terakhir") {
      startDate.setDate(now.getDate());
      startDate.setDate(startDate.getDate() - 3);
      filterQuery.transactionDate = {
        $gte: startDate,
        $lte: endDate,
      };
    } else if (date === "7 hari terakhir") {
      startDate.setDate(now.getDate());
      startDate.setDate(startDate.getDate() - 7);

      filterQuery.transactionDate = {
        $gte: startDate,
        $lte: endDate,
      };
    } else if (date === "14 hari terakhir") {
      startDate.setDate(now.getDate());
      startDate.setDate(startDate.getDate() - 14);

      filterQuery.transactionDate = {
        $gte: startDate,
        $lte: endDate,
      };
    } else if (date === "30 hari terakhir") {
      startDate.setDate(now.getDate());
      startDate.setDate(startDate.getDate() - 30);

      filterQuery.transactionDate = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    let sort: { [key: string]: 1 | -1 } = {
      transactionDate: -1,
    };

    if (searchParams.get("sort") === "total-asc") {
      sort = {
        transactionDate: -1,
        paymentTotal: 1,
      };
    } else if (searchParams.get("sort") === "total-desc") {
      sort = {
        transactionDate: -1,
        paymentTotal: -1,
      };
    }

    const transaction = await Transaction.find(filterQuery)
      .skip(skip)
      .limit(limit)
      .sort(sort)
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
