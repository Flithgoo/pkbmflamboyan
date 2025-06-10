import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "./lib/jwt";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  let user = null;

  if (token) {
    try {
      user = await verifyJwt(token); // user = { id, email, role }
    } catch (error) {
      console.error("JWT verification failed:", error);
      user = null;
    }
  }

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Proteksi berdasarkan role dan path
  const path = request.nextUrl.pathname;
  console.log("User path:", path);

  // Jika user mencoba mengakses path yang bukan rolenya, redirect ke path sesuai role user
  if (path.startsWith("/LMS/admin") && user.role !== "admin") {
    return NextResponse.redirect(new URL(`/LMS/${user.role}`, request.url));
  }
  if (path.startsWith("/LMS/tutor") && user.role !== "tutor") {
    return NextResponse.redirect(new URL(`/LMS/${user.role}`, request.url));
  }
  if (path.startsWith("/LMS/pelajar") && user.role !== "pelajar") {
    return NextResponse.redirect(new URL(`/LMS/${user.role}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/LMS/:path*"],
};
