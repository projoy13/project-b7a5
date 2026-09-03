"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect } from "react";
import { registerAction } from "../_actions/authAction";
// import { Toast } from "@base-ui/react";
import { toast } from "@/components/ui/toast";

const ROLES = [
  { value: "PROVIDER", label: "List my gears" },
  { value: "CUSTOMER", label: "Rent gears" },
];

export default function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, {
    success: false,
    message: "",
  });
  useEffect(()=>{
    if(state.message &&!state.success ){
   toast.add({
    title:state.message
   })
    }
  })

  return (
    <Card className="p-6">
      <h2 className="mb-6 text-2xl font-bold">Create Account</h2>

      <form action={action}>
        {/* Name */}
        <div className="mb-4">
          <Label htmlFor="name">Name</Label>

          <Input
            id="name"
            name="name"
            placeholder="Your name"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <Label htmlFor="email">Email</Label>

          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Your email"
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
          />
        </div>

        {/* Role */}
        <div className="mb-4">
          <Label htmlFor="role">I want to</Label>

          <select
            id="role"
            name="role"
            className="mt-2 w-full rounded-md border px-3 py-2"
          >
            {ROLES.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        {/* Error / Success message */}
        {state.message && (
          <p className="mb-4 text-sm">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {pending ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </Card>
  );
}