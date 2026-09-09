"use server";

import { api } from "@/lib/api";
import type { LoginState } from "@/lib/types";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

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

  redirect("/api/dashboard");
};

export const registerAction = async (
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> => {
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

  redirect("/api/dashboard");
};

export const logout = async () => {
    const cookieStore = await cookies();
    
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    revalidateTag("my-profile", "max");
    // redirect("/login");
}