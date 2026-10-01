import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);
  const isAuthPage =
    pathname === "/signin" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password";

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(sessionCookie ? "/overview" : "/signin", request.url),
    );
  }

  if (!sessionCookie && !isAuthPage) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

// if you want to change the base path pls do on this matcher and change the basePath in .env
export const config = {
  matcher: ["/((?!api/v1/auth|_next|favicon.ico).*)"],
};
