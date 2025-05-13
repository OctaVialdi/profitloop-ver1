
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface LoginFormErrorAlertProps {
  loginError: string | null;
}

const LoginFormErrorAlert = ({ loginError }: LoginFormErrorAlertProps) => {
  if (!loginError) return null;
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{loginError}</AlertDescription>
    </Alert>
  );
};

export default LoginFormErrorAlert;
