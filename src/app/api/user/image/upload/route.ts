import { s3 } from "@/lib/aws3";
import { ResponseError } from "@/lib/response-error";
import { Upload } from "@aws-sdk/lib-storage";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "File not found" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${uuid()}-${file.name}`;

    const uploadParams = {
      Bucket: process.env.NEXT_AWS_BUCKET!,
      Key: filename,
      Body: buffer,
      ContentType: file.type,
    };

    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);

    const upload = new Upload({
      client: s3,
      params: uploadParams,
    });

    await upload.done();

    const fileUrl = `https://${process.env.NEXT_AWS_BUCKET}.s3.${process.env.NEXT_AWS_REGION}.amazonaws.com/${filename}`;

    return NextResponse.json(
      { success: true, message: "File uploaded successfully", url: fileUrl },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}
