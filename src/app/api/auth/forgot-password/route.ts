import connectDB from "@/lib/db";
import User from "@/lib/models/user-model";
import { ResponseError } from "@/lib/response-error";
import { NextRequest, NextResponse } from "next/server";
// import { Resend } from "resend";
import { compileResetTemplate } from "@/lib/template/send";
import VerifyToken from "@/lib/models/verify-model";
import nodemailer from "nodemailer";

// const { DOMAIN, RESEND_APIKEY } = process.env;

// const resend = new Resend(RESEND_APIKEY);

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const { email } = await req.json();

    const user = await User.findOne({ email: email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Email tidak terdaftar" },
        { status: 404 }
      );
    }

    const expired = new Date().getTime() + 60 * 60 * 1000;

    const verify = new VerifyToken({ email, expired });

    const { _id: token } = await verify.save();

    const confirmLink = `${process.env.NEXT_PUBLIC_DOMAIN}/reset-password?token=${token} `;

    const emailHtml = await compileResetTemplate(confirmLink);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ADMIN,
        pass: process.env.PASSWORD_APLIKASI_EMAIL,
      },
    });

    await transporter.sendMail({
      from: "no-reply <onboarding@resend.dev>",
      to: email,
      subject: "Reset Password",
      html: emailHtml,
    });

    // await resend.emails.send({
    //   from: "no-reply <onboarding@resend.dev>",
    //   to: ["anwarhakim001@gmail.com"],
    //   subject: "Reset Password",
    //   html: emailHtml,
    // });

    return NextResponse.json(
      { success: true, message: "Request reset password success" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}
