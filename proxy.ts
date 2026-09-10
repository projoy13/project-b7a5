import jwt, { JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_ROUTES = [
  "/api/auth/login",
  "/api/auth/register",
];

const PUBLIC_ROUTES = [
  "/",
  "/gear",
  "/api/gear",
  "/api/categories",
];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const accessToken = request.cookies.get("accessToken")?.value;

  let userRole: string | null = null;

  if (accessToken) {
    const decodedToken = jwt.decode(accessToken) as JwtPayload | null;

    if (decodedToken) {
      userRole =
        typeof decodedToken.role === "string"
          ? decodedToken.role
          : null;
    }
  }

  const isAuthRoute = AUTH_ROUTES.some(
    (route) =>
      pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isAuthRoute) {
    return NextResponse.next();
  }

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) =>
      pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (!accessToken) {
    return NextResponse.redirect(
      new URL("/api/auth/login", request.url)
    );
  }

  if (
    pathname === "/api/dashboard" ||
    pathname.startsWith("/api/dashboard/")
  ) {
    if (userRole !== "CUSTOMER") {
      return NextResponse.redirect(
        new URL("/not-found", request.url)
      );
    }
  }

  if (
    pathname === "/api/admin-dashboard" ||
    pathname.startsWith("/api/admin-dashboard/")
  ) {
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(
        new URL("/not-found", request.url)
      );
    }
  }

  if (
    pathname === "/api/provider-dashboard" ||
    pathname.startsWith("/api/provider-dashboard/")
  ) {
    if (userRole !== "PROVIDER") {
      return NextResponse.redirect(
        new URL("/not-found", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};