import crypto from "crypto";
import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminPassword,
} from "@/lib/admin-auth";

type LoginBody = {
  password?: unknown;
};

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left, "utf8");
  const rightBuffer = Buffer.from(right, "utf8");

  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginBody;
    const password = typeof body.password === "string" ? body.password : "";

    if (!password) {
      return NextResponse.json({ message: "Password is required." }, { status: 400 });
    }

    const configuredPassword = getAdminPassword();
    if (!safeEqual(password, configuredPassword)) {
      return NextResponse.json({ message: "Invalid password." }, { status: 401 });
    }

    const sessionToken = createAdminSessionToken();
    const response = NextResponse.json({ ok: true }, { status: 200 });
    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: sessionToken,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Login failed." },
      { status: 500 },
    );
  }
}
