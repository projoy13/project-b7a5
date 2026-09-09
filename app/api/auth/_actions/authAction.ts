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

  console.log("LOGIN API RESPONSE:", res);

  if (!res.success) {
    return {
      success: false,
      message: res.message ?? "Invalid email or password",
    };
  }

  // Backend response:
  //
  // {
  //   message: "User logged in successfully",
  //   data: {
  //     accessToken: "...",
  //     refreshToken: "..."
  //   }
  // }
  //
  // api() wraps that response inside another data property.
  //
  // Therefore:
  // res.data.data.accessToken
  // res.data.data.refreshToken

  const accessToken = res.data?.data?.accessToken;
  const refreshToken = res.data?.data?.refreshToken;

  console.log("ACCESS TOKEN EXISTS:", !!accessToken);
  console.log("REFRESH TOKEN EXISTS:", !!refreshToken);

  if (!accessToken || !refreshToken) {
    return {
      success: false,
      message: "Login response does not contain authentication tokens.",
    };
  }

  // Save authentication cookies
  await setAuthCookies({
    accessToken,
    refreshToken,
  });

  // Decode access token to get user's role
  const decoded = jwt.decode(accessToken) as DecodedToken | null;

  console.log("DECODED USER:", decoded);

  if (!decoded || !decoded.role) {
    return {
      success: false,
      message: "Invalid access token",
    };
  }

  console.log("USER ROLE:", decoded.role);

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

  console.log("REGISTER API RESPONSE:", res);

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

  console.log("AUTO LOGIN RESPONSE:", login);

  if (!login.success) {
    return {
      success: false,
      message: "Registration successful, but automatic login failed.",
    };
  }

  const accessToken = login.data?.data?.accessToken;
  const refreshToken = login.data?.data?.refreshToken;

  if (!accessToken || !refreshToken) {
    return {
      success: false,
      message: "Login response does not contain authentication tokens.",
    };
  }

  // Save authentication cookies
  await setAuthCookies({
    accessToken,
    refreshToken,
  });

  // Decode token to get role
  const decoded = jwt.decode(accessToken) as DecodedToken | null;

  console.log("REGISTERED USER:", decoded);

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