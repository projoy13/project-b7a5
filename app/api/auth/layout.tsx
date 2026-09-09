import { Navbar } from "@/components/shared/navbar";
import { getMe } from "@/service/getme";
import React from "react";

const AuthGroupLayout =async ({

  children,
}: {
  children: React.ReactNode;
}) => {
  const user=await getMe()
  return (
    <div className="max-w-7xl mx-auto bg-green-900">
      <Navbar user={user}></Navbar>
      {children}
    </div>
  );
};

export default AuthGroupLayout;