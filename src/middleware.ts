import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const protectedPaths = ["/dashboard"];
const authPaths = ["/login", "/register"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const isLoggedIn = !!token;
  const isAuthPath = authPaths.includes(pathname);
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // Handle token expiration
  if (token?.expired) {
    const isExpired = Date.now() > (token.expired as number) * 1000;
    if (isExpired) {
      const response = NextResponse.redirect(new URL("/login", req.url));
      // Clear all auth cookies (more thorough approach)
      ["next-auth.session-token", "__Secure-next-auth.session-token"].forEach(
        (cookie) => {
          response.cookies.set(cookie, "", { maxAge: -1 });
        }
      );
      return response;
    }
  }

  // Redirect rules
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!isLoggedIn && isProtectedPath) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isLoggedIn && isAuthPath) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login", "/register"],
};
