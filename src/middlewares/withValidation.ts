import { ServerURL } from "@/utils/contant";

import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";

const getTransaction = async (id: string) => {
  const res = await fetch(`${ServerURL}/transaction?transactionId=` + id);

  const data = await res.json();

  return data;
};

export default function withValidation(middleware: NextMiddleware) {
  return async (req: NextRequest, ev: NextFetchEvent) => {
    const pathname = req.nextUrl.pathname;
    const id = pathname.split("/")[2];

    if (pathname.startsWith("/checkout/") || pathname === "checkout") {
      const data = await getTransaction(id);

      if (data.status === 404) {
        return NextResponse.redirect(new URL("/not-found", req.url));
      }
      if (data.status === 500) {
        return NextResponse.redirect(new URL("/error", req.url));
      }

      if (
        data.transaction.paymentCode &&
        data.transaction.paymentName &&
        data.transaction.paymentCreated &&
        data.transaction.paymentExpired
      ) {
        return NextResponse.redirect(new URL(`/pembayaran/${id}`, req.url));
      }
    }

    if (pathname.startsWith("/pembayaran/") || pathname === "pembayaran") {
      const data = await getTransaction(id);
      const status = req.nextUrl.searchParams.get("status");

      if (data.status === 404) {
        return NextResponse.redirect(new URL("/not-found", req.url));
      }
      if (data.status === 500) {
        return NextResponse.redirect(new URL("/error", req.url));
      }

      if (
        data &&
        !data.transaction.paymentCode &&
        !data.transaction.paymentMethod &&
        !data.transaction.paymentName &&
        !data.transaction.paymentCreated &&
        !data.transaction.paymentExpired
      ) {
        return NextResponse.redirect(new URL(`/checkout/${id}`, req.url));
      }

      if (!status) {
        if (
          (data && data.transaction.paymentStatus === "kadaluwarsa") ||
          data.transaction.paymentStatus === "ditolak" ||
          data.transaction.paymentStatus === "dibatalkan"
        ) {
          return NextResponse.redirect(
            new URL(`/pembayaran/${id}?status=gagal`, req.url)
          );
        }
        if (data && data.transaction.paymentStatus === "dibayar") {
          return NextResponse.redirect(
            new URL(`/pembayaran/${id}?status=sukses`, req.url)
          );
        }
      }
    }

    return middleware(req, ev);
  };
}
