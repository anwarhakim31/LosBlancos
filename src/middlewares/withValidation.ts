import { ServerURL } from "@/utils/contant";

import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";

const getTransaction = async (req: NextRequest, id: string) => {
  const res = await fetch(`${ServerURL}/transaction?transactionId=` + id);

  if (!res.ok) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const data = await res.json();

  return data;
};

export default function withValidation(middleware: NextMiddleware) {
  return async (req: NextRequest, ev: NextFetchEvent) => {
    const pathname = req.nextUrl.pathname;
    const id = pathname.split("/")[2];

    if (pathname.startsWith("/checkout/") || pathname === "checkout") {
      const data = await getTransaction(req, id);

      if (
        data.transaction.paymentCode ||
        data.transaction.paymentMethod ||
        data.transaction.paymentName ||
        data.transaction.paymentCreated ||
        data.transaction.paymentExpired ||
        data.transaction.paymentStatus !== "tertunda"
      ) {
        return NextResponse.redirect(new URL(`/pembayaran/${id}`, req.url));
      }
    }

    if (pathname.startsWith("/pembayaran/") || pathname === "pembayaran") {
      // const data = await getTransaction(req, id);
    }

    return middleware(req, ev);
  };
}
