
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8 px-4">
        <div className="w-full max-w-md mx-auto text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-600">Multi-Tenant App</h1>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
