import { NextResponse } from "next/server";

export const ResponseError = (status: number, message: string) => {
  return NextResponse.json({ success: false, message }, { status: status });
};
