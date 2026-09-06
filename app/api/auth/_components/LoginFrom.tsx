"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { loginAction } from "../_actions/authAction";
import type { LoginState } from "@/lib/types";

const initialState: LoginState = {
  success: false,
  message: "",
};

export default function LoginForm() {
  const router = useRouter();

  const [state, action, pending] = useActionState<LoginState, FormData>(
    loginAction,
    initialState
  );

  useEffect(() => {
    if (!state.message) return;

    if (state.success) {
      toast.success(state.message);

      const timer = setTimeout(() => {
        router.push("/api/dashboard");
      }, 1500);

      return () => clearTimeout(timer);
    }

    toast.error(state.message);
  }, [state, router]);

  return (
    <Card className="p-6">
      <h2 className="mb-6 text-2xl font-bold">Sign in</h2>

      <form action={action}>
        {/* Email */}
        <div className="mb-4">
          <Label htmlFor="email">Email</Label>

          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Your email"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <Label htmlFor="password">Password</Label>

          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Your password"
            required
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {pending ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </Card>
  );
}