import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const protectedPaths = ["/dashboard"];
const authPaths = ["/login", "/register"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const isTokenValid = token && !token.expired && token.accessToken;
  const isLoggedIn = !!isTokenValid;
  const isAuthPath = authPaths.includes(pathname);
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );
  if (token && (token.expired || !token.accessToken)) {
    const response = NextResponse.redirect(new URL("/login", req.url));
    // Clear all auth cookies
    // Clear all possible NextAuth cookies
    const cookiesToClear = [
      "next-auth.session-token",
      "__Secure-next-auth.session-token",
      "next-auth.csrf-token",
      "__Host-next-auth.csrf-token",
      "next-auth.callback-url",
      "__Secure-next-auth.callback-url",
    ];
    cookiesToClear.forEach((cookieName) => {
      response.cookies.set(cookieName, "", {
        maxAge: -1,
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
    });
    return response;
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
