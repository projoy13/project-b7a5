"use server";

import { cookies } from "next/headers";

export const refreshToken = async () => {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get("accessToken")?.value || null;

  if (!refreshToken) {
    return {
      success: false,
      message:"refresh token not found",
    
    };
  }

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/auth/refresh-token`,
    {
      headers: {
        method:"post",
        Cookie: `refreshToken=${refreshToken}`,
      },
      cache: "no-store",
    }
  );

  const result = await res.json();

  return result;
};