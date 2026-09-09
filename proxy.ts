import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { JwtPayload } from "jsonwebtoken";
import { jwtUtils } from "./utils/jwt";

const AUTH_ROUTES = [
  "/api/auth/login",
  "/api/auth/register",
];

const PUBLIC_ROUTES = [
  "/",
];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // --------------------------------
  // Get tokens from cookies
  // --------------------------------

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // --------------------------------
  // AUTH ROUTES
  // --------------------------------

  const isAuthRoute = AUTH_ROUTES.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`)
  );

  if (isAuthRoute) {
    return NextResponse.next();
  }

  // --------------------------------
  // PUBLIC ROUTES
  // --------------------------------

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // --------------------------------
  // NO ACCESS TOKEN
  // --------------------------------

  if (!accessToken) {
    // If there is no access token but
    // refresh token exists, try refreshing.
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(
          `${process.env.API_URL}/api/auth/refresh-token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              refreshToken,
            }),
          }
        );

        const refreshResult = await refreshResponse.json();

        if (refreshResponse.ok && refreshResult.data?.accessToken) {
          const newAccessToken =
            refreshResult.data.accessToken;

          const response = NextResponse.next();

          response.cookies.set(
            "accessToken",
            newAccessToken,
            {
              httpOnly: true,
              maxAge: 24 * 60 * 60,
              sameSite: "lax",
              secure:
                process.env.NODE_ENV === "production",
              path: "/",
            }
          );

          return response;
        }
      } catch (error) {
        console.log(
          "REFRESH TOKEN REQUEST FAILED:",
          error
        );
      }
    }

    return NextResponse.redirect(
      new URL("/api/auth/login", request.url)
    );
  }

  // --------------------------------
  // VERIFY ACCESS TOKEN
  // --------------------------------

  let decodedAccessToken: string | JwtPayload;

  try {
    decodedAccessToken = jwtUtils.verifyToken(
      accessToken,
      process.env.JWT_ACCESS_SECRET as string
    );
  } catch (error) {
    console.log("ACCESS TOKEN EXPIRED OR INVALID");

    // --------------------------------
    // ACCESS TOKEN INVALID
    // TRY REFRESH TOKEN
    // --------------------------------

    if (!refreshToken) {
      return NextResponse.redirect(
        new URL("/api/auth/login", request.url)
      );
    }

    try {
      const refreshResponse = await fetch(
        `${process.env.API_URL}/api/auth/refresh-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refreshToken,
          }),
        }
      );

      const refreshResult = await refreshResponse.json();

      if (
        !refreshResponse.ok ||
        !refreshResult.data?.accessToken
      ) {
        return NextResponse.redirect(
          new URL("/api/auth/login", request.url)
        );
      }

      const newAccessToken =
        refreshResult.data.accessToken;

      // --------------------------------
      // Create response
      // --------------------------------

      const response = NextResponse.next();

      // --------------------------------
      // Save new access token
      // --------------------------------

      response.cookies.set(
        "accessToken",
        newAccessToken,
        {
          httpOnly: true,
          maxAge: 24 * 60 * 60,
          sameSite: "lax",
          secure:
            process.env.NODE_ENV === "production",
          path: "/",
        }
      );

      // --------------------------------
      // Decode NEW access token
      // --------------------------------

      let decodedNewAccessToken:
        | string
        | JwtPayload;

      try {
        decodedNewAccessToken =
          jwtUtils.verifyToken(
            newAccessToken,
            process.env.JWT_ACCESS_SECRET as string
          );
      } catch {
        return NextResponse.redirect(
          new URL("/api/auth/login", request.url)
        );
      }

      if (
        typeof decodedNewAccessToken === "string" ||
        typeof decodedNewAccessToken.role !== "string"
      ) {
        return NextResponse.redirect(
          new URL("/api/auth/login", request.url)
        );
      }

      const userRole =
        decodedNewAccessToken.role;

      // --------------------------------
      // CUSTOMER
      // --------------------------------

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

      // --------------------------------
      // ADMIN
      // --------------------------------

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

      // --------------------------------
      // PROVIDER
      // --------------------------------

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

      return response;
    } catch (error) {
      console.log(
        "REFRESH TOKEN FAILED:",
        error
      );

      return NextResponse.redirect(
        new URL("/api/auth/login", request.url)
      );
    }
  }

  // --------------------------------
  // ACCESS TOKEN IS VALID
  // --------------------------------

  if (
    typeof decodedAccessToken === "string" ||
    typeof decodedAccessToken.role !== "string"
  ) {
    return NextResponse.redirect(
      new URL("/api/auth/login", request.url)
    );
  }

  const userRole = decodedAccessToken.role;

  // --------------------------------
  // CUSTOMER DASHBOARD
  // --------------------------------

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

  // --------------------------------
  // ADMIN DASHBOARD
  // --------------------------------

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

  // --------------------------------
  // PROVIDER DASHBOARD
  // --------------------------------

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