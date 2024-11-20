import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export { default } from "next-auth/middleware";

export async function middleware(req: NextRequest) {
  const session = await getToken({ req, secret: process.env.JWT_SECRET });
  const pathname = req.nextUrl.pathname;

  // 로그인 된 유저만 접근 가능
  if (pathname.startsWith("/user") && !session) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // 관리자 유저만 접근 가능
  if (pathname.startsWith("/admin") && session?.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 로그인 된 유저는 로그인, 회원가입 페이지에 접근 불가
  if (pathname.startsWith("/auth") && session) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
