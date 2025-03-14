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

const failed = ["kadaluwarsa", "ditolak", "dibatalkan"];
const row = [8, 16, 24];

export default function withValidation(middleware: NextMiddleware) {
  return async (req: NextRequest, ev: NextFetchEvent) => {
    const pathname = req.nextUrl.pathname;

    const id = pathname.split("/")[2];

    if (pathname.startsWith("/admin/")) {
      const searchParams = req.nextUrl.searchParams;

      const page = searchParams.get("page");
      const limit = searchParams.get("limit");

      if (page && parseInt(page) < 1) {
        return NextResponse.redirect(
          new URL(`${req.nextUrl.pathname}?page=1`, req.url)
        );
      }

      if (limit && !row.includes(parseInt(limit))) {
        return NextResponse.redirect(
          new URL(`${req.nextUrl.pathname}?limit=8`, req.url)
        );
      }
    }

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
        if (failed.includes(data.transaction.paymentStatus)) {
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

      if (status) {
        if (status !== "sukses" && status !== "gagal") {
          return NextResponse.redirect(new URL(`/pembayaran/${id}`, req.url));
        }

        if (
          data.transaction.paymentStatus === "dibayar" &&
          status !== "sukses"
        ) {
          return NextResponse.redirect(
            new URL(`/pembayaran/${id}?status=sukses`, req.url)
          );
        }

        if (
          failed.includes(data.transaction.paymentStatus) &&
          status === "sukses"
        ) {
          return NextResponse.redirect(
            new URL(`/pembayaran/${id}?status=gagal`, req.url)
          );
        }
      }

      if (
        status === "sukses" &&
        data.transaction.paymentStatus === "tertunda"
      ) {
        {
          return NextResponse.redirect(new URL(`/pembayaran/${id}`, req.url));
        }
      }

      if (status === "gagal" && data.transaction.paymentStatus === "tertunda") {
        {
          return NextResponse.redirect(new URL(`/pembayaran/${id}`, req.url));
        }
      }
    }

    return middleware(req, ev);
  };
}
