"use server";

import { api } from "@/lib/api";
import type { LoginState } from "@/lib/types";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import jwt from "jsonwebtoken";

type DecodedToken = {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN" | "PROVIDER";
};

const setAuthCookies = async ({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) => {
  const cookieStore = await cookies();

  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
};

export const loginAction = async (
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> => {
  const res = await api("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: formData.get("email"),
      password: formData.get("password"),
    }),
  });

  if (!res.success) {
    return {
      success: false,
      message: res.message ?? "Invalid email or password",
    };
  }

  await setAuthCookies(res.data);

  // Decode access token to get the user's role
  const decoded = jwt.decode(res.data.accessToken) as DecodedToken | null;

  console.log("Decoded user:", decoded);

  if (!decoded || !decoded.role) {
    return {
      success: false,
      message: "Invalid access token",
    };
  }

  console.log("User role:", decoded.role);

  // CUSTOMER
  if (decoded.role === "CUSTOMER") {
    redirect("/api/dashboard");
  }

  // ADMIN
  if (decoded.role === "ADMIN") {
    redirect("/api/admin-dashboard");
  }

  // PROVIDER
  if (decoded.role === "PROVIDER") {
    redirect("/api/provider-dashboard");
  }

  return {
    success: false,
    message: "Invalid user role",
  };
};

export const registerAction = async (
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> => {
  // Register user
  const res = await api("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
    }),
  });

  if (!res.success) {
    return {
      success: false,
      message: res.message ?? "Registration failed",
    };
  }

  // Automatically login after registration
  const login = await api("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: formData.get("email"),
      password: formData.get("password"),
    }),
  });

  if (!login.success) {
    return {
      success: false,
      message: "Registration successful, but automatic login failed.",
    };
  }

  await setAuthCookies(login.data);

  // Decode token to get role
  const decoded = jwt.decode(login.data.accessToken) as DecodedToken | null;

  console.log("Registered user:", decoded);

  if (!decoded || !decoded.role) {
    return {
      success: false,
      message: "Invalid access token",
    };
  }

  // CUSTOMER
  if (decoded.role === "CUSTOMER") {
    redirect("/api/dashboard");
  }

  // ADMIN
  if (decoded.role === "ADMIN") {
    redirect("/api/admin-dashboard");
  }

  // PROVIDER
  if (decoded.role === "PROVIDER") {
    redirect("/api/provider-dashboard");
  }

  return {
    success: false,
    message: "Invalid user role",
  };
};

export const logout = async () => {
  const cookieStore = await cookies();

  console.log(
    "BEFORE LOGOUT:",
    cookieStore.get("accessToken")?.value
      ? "TOKEN EXISTS"
      : "NO TOKEN"
  );

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  revalidateTag("my-profile", "max");

  console.log(
    "AFTER LOGOUT:",
    cookieStore.get("accessToken")?.value
      ? "TOKEN STILL EXISTS"
      : "NO TOKEN"
  );
};