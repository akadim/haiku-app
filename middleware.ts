import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "./actions/HaikuController";

const publicRoutes = ["/", "/login", "api/auth"];

export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  const isPublicRoute = publicRoutes.some((route) => pathname === route);

  const token = request.cookies.get("ourHaikuApp")?.value;

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (!token) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("callback", pathname);

    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
};

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
