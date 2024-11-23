import Notification from "@/lib/models/notification-model";
import { ResponseError } from "@/lib/response-error";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { dataId, messageId } = await req.json();

    const notif = await Notification.findOne({ dataId, _id: messageId });

    if (!notif) {
      return ResponseError(404, "Notifikasi tidak ditemukan");
    }

    await Notification.deleteOne({ dataId, _id: messageId });

    return NextResponse.json({
      success: true,
      message: "Notifikasi telah dibaca",
    });
  } catch (error) {
    ResponseError(500, "Internal Server Error");
  }
}

export async function DELETE() {
  try {
    const notif = await Notification.find({ read: false }).select("_id");

    if (!notif) {
      return ResponseError(404, "Notifikasi tidak ditemukan");
    }

    await Notification.deleteMany({ read: false });

    return NextResponse.json({
      success: true,
      message: "Notifikasi telah dibaca",
    });
  } catch (error) {
    ResponseError(500, "Internal Server Error");
  }
}
