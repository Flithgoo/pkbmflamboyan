import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "./lib/jwt";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  let user = null;

  if (token) {
    try {
      user = verifyJwt(token);
    } catch (error) {
      console.error("JWT verification failed:", error);
      user = null;
    }
  }

  if (!user) {
    return NextResponse.redirect(new URL("/login/pelajar", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/LMS/:path*"],
};
