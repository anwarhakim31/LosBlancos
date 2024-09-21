import withAuth from "./middlewares/withAuth";
import { NextResponse } from "next/server";

function mainMiddleware() {
  const res = NextResponse.next();

  return res;
}

export default withAuth(mainMiddleware, ["admin", "login"]);
