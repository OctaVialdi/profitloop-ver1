
import { ReactNode, useEffect } from "react";
import { Outlet } from "react-router-dom";

interface AuthLayoutProps {
  children?: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8 px-4">
        <div className="w-full max-w-md mx-auto text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-600">ProfitLoop</h1>
        </div>
        {children || <Outlet />}
      </div>
    </div>
  );
};

export default AuthLayout;
