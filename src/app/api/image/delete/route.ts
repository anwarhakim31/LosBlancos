import { s3 } from "@/lib/aws3";
import { ResponseError } from "@/lib/response-error";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const { filename } = await req.json(); // Mendapatkan nama file dari request body

    const file = filename.split("/")[3];

    if (!filename) {
      return NextResponse.json(
        { success: false, message: "Filename not provided" },
        { status: 400 }
      );
    }

    const deleteParams = {
      Bucket: process.env.NEXT_AWS_BUCKET!,
      Key: file,
    };

    const command = new DeleteObjectCommand(deleteParams);
    await s3.send(command);

    return NextResponse.json(
      { success: true, message: `File ${file} deleted successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return ResponseError(500, "Internal Server Error");
  }
}
