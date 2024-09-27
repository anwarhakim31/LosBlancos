import { getToken } from "next-auth/jwt";
import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";

const onlyAdmin = ["admin"];

const authPage = ["login", "register", "forget-password", "reset-password"];

export default function withAuth(
  middleware: NextMiddleware,
  requireAuth: string[] = []
) {
  return async (req: NextRequest, ev: NextFetchEvent) => {
    const pathname = req.nextUrl.pathname.split("/")[1];

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (requireAuth.includes(pathname)) {
      if (!token && !authPage.includes(pathname)) {
        const url = new URL("/login", req.url);
        url.searchParams.set("callbackUrl", encodeURI(req.url));

        return NextResponse.redirect(url);
      }
      if (token) {
        if (authPage.includes(pathname)) {
          return NextResponse.redirect(new URL("/", req.url));
        }

        if (token.role === "admin" && !onlyAdmin.includes(pathname)) {
          return NextResponse.redirect(new URL("/admin", req.url));
        }

        if (token.role !== "admin" && onlyAdmin.includes(pathname)) {
          return NextResponse.redirect(new URL("/", req.url));
        }
      }
    }

    if (token && token.role === "admin") {
      if (req.nextUrl.pathname === "/" || authPage.includes(pathname)) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    }

    return middleware(req, ev);
  };
}

export const config = {
  matcher: ["/", "/login"],
};
