import { api } from "@/lib/api";
import { User } from "@/lib/types";
import { cookies } from "next/headers";
// import jwt from "jsonwebtoken" 
import { decodeToken } from "@/utils/jwt";

const getMe = async (): Promise<User | null> => {
  const token =decodeToken((await cookies()).get("accessToken")!.value);
  

  if (!token) return null;

  const res = await api("/api/users/me", {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.success) return null;

  return res.data.user as User;
};

export default getMe;