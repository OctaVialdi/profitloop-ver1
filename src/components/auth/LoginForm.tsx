
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";

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
    <form onSubmit={onSubmit} className="space-y-4">
      {loginError && (
        <Alert className="bg-red-50 text-red-800 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription>{loginError}</AlertDescription>
        </Alert>
      )}
      
      {isEmailUnverified && (
        <Alert className="bg-amber-50 text-amber-800 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="flex flex-col space-y-2">
            <span>Email belum diverifikasi. Silakan verifikasi email Anda terlebih dahulu.</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-fit bg-amber-100 hover:bg-amber-200 border-amber-300"
              onClick={onResendVerification}
              disabled={resendingVerification}
            >
              {resendingVerification ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Mengirim ulang...
                </>
              ) : (
                "Kirim ulang email verifikasi"
              )}
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@perusahaan.com"
          required
          readOnly={isEmailReadOnly}
          className={isEmailReadOnly ? "bg-gray-100" : ""}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <a
            href="#"
            className="text-sm text-blue-500 hover:text-blue-700"
            onClick={(e) => {
              e.preventDefault();
              // Handle forgot password
              alert("Fitur lupa password belum tersedia.");
            }}
          >
            Lupa password?
          </a>
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Memproses...
          </>
        ) : (
          "Login"
        )}
      </Button>
    </form>
  );
};

export default LoginForm;
