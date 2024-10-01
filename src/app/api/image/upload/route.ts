import { s3 } from "@/lib/aws3";

import { ResponseError } from "@/lib/response-error";
import { verifyToken } from "@/lib/verify-token";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export async function POST(req: NextRequest) {
  try {
    verifyToken(req);

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return ResponseError(400, "File tidak ditemukan");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${uuid()}#-#${file.name}`;

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

    upload.on("httpUploadProgress", () => {
      // sendProgress({
      //   loaded: progress.loaded,
      //   total: progress.total,
      // });
    });

    await upload.done();

    const fileUrl = `https://${process.env.NEXT_AWS_BUCKET}.s3.${process.env.NEXT_AWS_REGION}.amazonaws.com/${filename}`;

    return NextResponse.json(
      { success: true, message: "File uploaded successfully", image: fileUrl },
      { status: 200 }
    );
  } catch (error) {
    ResponseError(500, "Internal Server Error");
  }
}
