
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ErrorStateProps {
  error: string;
  email?: string | null;
  token?: string | null;
  onManualLogin?: () => void;
}

const ErrorState = ({ error, email, token, onManualLogin }: ErrorStateProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <CardTitle className="text-center">
          Undangan Tidak Valid
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center mb-6">{error}</p>
        {email && token && (
          <div className="flex flex-col gap-4">
            <p className="text-center text-sm text-gray-500">
              Link telah kadaluarsa. Anda masih dapat bergabung dengan login terlebih dahulu.
            </p>
            <Button onClick={onManualLogin} className="w-full">
              Login untuk Bergabung
            </Button>
            <div className="text-center">
              <span className="text-sm text-gray-500">atau</span>
            </div>
          </div>
        )}
        <div className="flex justify-center mt-4">
          <Button onClick={() => navigate("/auth/login")} variant="outline">
            Kembali ke Login
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorState;
