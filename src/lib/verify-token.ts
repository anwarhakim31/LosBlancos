import { NextRequest, NextResponse } from "next/server";

import jwt from "jsonwebtoken";

export const verifyToken = (req: NextRequest, roles: string[] = []) => {
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Sesi login telah habis. Jika ingin melanjutkan silahkan login kembali.",
      },
      { status: 401 }
    );
  }

  try {
    const secret = process.env.NEXTAUTH_SECRET || "";
    const verify = jwt.verify(token, secret);

    if (verify && typeof verify === "object" && "role" in verify) {
      if (roles.length > 0 && !roles.includes(verify.role)) {
        return NextResponse.json(
          {
            success: false,
            message: "Hak akses tidak diberikan",
          },
          { status: 403 }
        );
      }

      return verify;
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Token tidak valid atau telah kedaluwarsa.",
      },
      { status: 401 }
    );
  }
};
