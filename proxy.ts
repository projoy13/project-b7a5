
import { notFound } from "next/navigation";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_ROUTES = [
  "/api/auth/login",
  "/api/auth/register",
];

const PUBLIC_ROUTES = [
  "/",
];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Get access token from cookie
  const accessToken = request.cookies.get("accessToken")?.value;

  // Decode token and get role
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

  // -----------------------------
  // AUTH ROUTES
  // -----------------------------
  //
  // Always allow login/register.
  // Do NOT redirect logged-in users
  // away from the login page.

  const isAuthRoute = AUTH_ROUTES.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`)
  );

  if (isAuthRoute) {
    return NextResponse.next();
  }

  // -----------------------------
  // PUBLIC ROUTES
  // -----------------------------

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // -----------------------------
  // PROTECTED ROUTES
  // -----------------------------

  if (!accessToken) {
    return NextResponse.redirect(
      new URL("/api/auth/login", request.url)
    );
  }

  // -----------------------------
  // CUSTOMER DASHBOARD
  // -----------------------------

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

  // -----------------------------
  // ADMIN DASHBOARD
  // -----------------------------

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

  // -----------------------------
  // PROVIDER DASHBOARD
  // -----------------------------

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
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};