import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken");

  if (!accessToken) {
    redirect("/api/login");
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold">
            Welcome to Dashboard 🎉
          </h1>

          <p className="mt-2 text-gray-500">
            You are successfully logged in.
          </p>
        </div>
      </div>
    </main>
  );
}