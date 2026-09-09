// "use server";

// import { cookies } from "next/headers";

// export const logout = async () => {
//   const cookieStore = await cookies();

//   console.log(
//     "BEFORE LOGOUT:",
//     cookieStore.get("accessToken")?.value ? "TOKEN EXISTS" : "NO TOKEN"
//   );

//   cookieStore.delete("accessToken");
//   cookieStore.delete("refreshToken");

//   console.log(
//     "AFTER LOGOUT:",
//     cookieStore.get("accessToken")?.value ? "TOKEN STILL EXISTS" : "NO TOKEN"
//   );
// };