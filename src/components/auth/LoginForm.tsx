
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import UnverifiedEmailAlert from "./UnverifiedEmailAlert";

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isLoading: boolean;
  loginError: string | null;
  isEmailUnverified: boolean;
  resendingVerification: boolean;
  onResendVerification: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isEmailReadOnly?: boolean;
}

const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  isLoading,
  loginError,
  isEmailUnverified,
  resendingVerification,
  onResendVerification,
  onSubmit,
  isEmailReadOnly = false
}: LoginFormProps) => {
  return (
    <>
      {loginError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{loginError}</AlertDescription>
        </Alert>
      )}
      
      {isEmailUnverified && (
        <UnverifiedEmailAlert 
          onResendVerification={onResendVerification} 
          isResending={resendingVerification} 
        />
      )}
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="nama@perusahaan.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly={isEmailReadOnly}
            className={isEmailReadOnly ? "bg-gray-100" : ""}
            required
            autoComplete="username" 
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/auth/forgot-password" className="text-sm text-blue-500 hover:text-blue-700">
              Lupa password?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {email ? "Memeriksa..." : "Memproses..."}
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </>
  );
};

export default LoginForm;
