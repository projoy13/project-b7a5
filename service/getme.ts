"use server";

import { cookies } from "next/headers";

export const getMe = async () => {
  try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value || null;

    if (!accessToken) {
      return {
        success: false,
        message: "User not logged in!",
        data: null,
      };
    }

    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/users/me`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return {
        success: false,
        message: "User not logged in!",
        data: null,
      };
    }

    const result = await res.json();

    return result;
  } catch (error) {
    console.error("GET ME ERROR:", error);

    return {
      success: false,
      message: "Unable to get user information",
      data: null,
    };
  }
};