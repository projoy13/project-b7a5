import React from "react";

const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="max-w-7xl mx-auto bg-red-400">
      {children}
    </div>
  );
};

export default DashboardLayout;