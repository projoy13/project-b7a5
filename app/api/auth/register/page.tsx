import Link from "next/link";
import RegisterForm from "../_components/RegisterForm";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="text-gray-500">Start renting in a minute</p>
        </div>

        {/* Register Form */}
        <div className="mt-8">
          <RegisterForm />
        </div>

        {/* Login Link */}
        <p className="mt-6 text-center">
          Already have an account?{" "}
          <Link
            href="/api/auth/login"
            className="font-medium underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}