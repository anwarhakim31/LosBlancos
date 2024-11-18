import withAuth from "./middlewares/withAuth";
import { NextResponse } from "next/server";
import withValidation from "./middlewares/withValidation";

function mainMiddleware() {
  return NextResponse.next();
}

export const middleware = withAuth(withValidation(mainMiddleware), [
  "admin",
  "login",
  "keinginan",
  "keranjang",
  "akun",
  "pesanan",
  "alamat",
  "checkout",
]);

export const config = {
  matcher: [
    "/admin/:path*",
    "/login",
    "/keinginan",
    "/keranjang",
    "/akun",
    "/pesanan",
    "/alamat",
    "/checkout",
  ],
};
