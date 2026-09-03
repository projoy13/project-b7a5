import Link from "next/link";
// import RegisterForm from "../_components/RegisterForm";
import LoginForm from "../_components/LoginFrom";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-gray-500">Sign in to manage</p>
        </div>

        {/* Login Form */}
        <div className="mt-8">
          <LoginForm />
        </div>

        {/* Login Link */}
        <p className="mt-6 text-center">
          Donot  have an account?{" "}
          <Link
            href="/register"
            className="font-medium underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}