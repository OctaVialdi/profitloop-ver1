
import React from "react";
import { RefreshCw } from "lucide-react";

interface VerificationStatusProps {
  isChecking: boolean;
}

export const VerificationStatus: React.FC<VerificationStatusProps> = ({ isChecking }) => {
  if (!isChecking) return null;

  return (
    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800 flex items-center">
      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
      Memeriksa status verifikasi...
    </div>
  );
};
