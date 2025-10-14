// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export default withAuth(
  function middleware(req) {
    const pathname = req.nextUrl.pathname;

    // ✅ Handle admin routes
    if (pathname.startsWith("/admin")) {
      if (pathname.startsWith("/admin/login") || pathname.startsWith("/admin/signup")) {
        return NextResponse.next();
      }

      const adminToken = req.cookies.get("admin_token")?.value;
      const loginUrl = new URL("/admin/login", req.url);

      if (!adminToken) {
        // 🚫 No token: clear any residual cookie
        const res = NextResponse.redirect(loginUrl);
        res.cookies.delete("admin_token");
        return res;
      }

      try {
        jwt.verify(adminToken, process.env.ADMIN_JWT_SECRET!);
        return NextResponse.next();
      } catch (err) {
        // 🚫 Expired or invalid token
        const res = NextResponse.redirect(loginUrl);
        res.cookies.delete("admin_token");
        return res;
      }
    }

    // ✅ Handle NextAuth routes for normal users
    const token = req.nextauth.token;
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const role = token.role;
    if (pathname.startsWith("/for-doctors") && role !== "doctor") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (pathname.startsWith("/for-pharmacists") && role !== "pharmacist") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (pathname.startsWith("/for-patients") && role !== "patient") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  { callbacks: { authorized: () => true } }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/for-doctors/:path*",
    "/for-pharmacists/:path*",
    "/for-patients/:path*",
    "/admin/:path*",
  ],
};
