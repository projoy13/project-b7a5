import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { decodeToken } from "./utils/jwt";

const PUBLIC_ROUTE = [
  "/login",
  "/register",
];

const ROUTE_ROLES = {
  "/dashboard": ["ADMIN", "PROVIDER", "CUSTOMER"],
  "/admin": ["ADMIN"],
  "/provider": ["PROVIDER"],
};

const goto = (path: string, request: NextRequest) => {
  return NextResponse.redirect(
    new URL(path, request.url)
  );
};

const matches = (
  pathname: string,
  route: string
) => {
  return (
    pathname === route ||
    pathname.startsWith(`${route}/`)
  );
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("accessToken")?.value;

  const role = token
    ? decodeToken(token)?.role
    : null;

  // Public routes
  if (PUBLIC_ROUTE.includes(pathname)) {
    if (role) {
      return goto("/dashboard", request);
    }

    return NextResponse.next();
  }

  // Find protected route
  const matchedRoute = Object.entries(ROUTE_ROLES).find(
    ([route]) => matches(pathname, route)
  );

  // Route doesn't need protection
  if (!matchedRoute) {
    return NextResponse.next();
  }

  const [, allowedRoles] = matchedRoute;

  // Not logged in
  if (!role) {
    return goto("/login", request);
  }

  // Wrong role
  if (!allowedRoles.includes(role)) {
    return goto("/", request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};