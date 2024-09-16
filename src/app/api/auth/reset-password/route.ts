import { ResponseError } from "@/lib/response-error";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return ResponseError(400, "Token tidak valid");
    }
  } catch (error) {}
}
