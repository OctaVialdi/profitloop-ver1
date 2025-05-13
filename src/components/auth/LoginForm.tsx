
import LoginFormErrorAlert from "./LoginFormErrorAlert";
import UnverifiedEmailAlert from "./UnverifiedEmailAlert";
import LoginFormFields from "./LoginFormFields";

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
      <LoginFormErrorAlert loginError={loginError} />
      
      {isEmailUnverified && (
        <UnverifiedEmailAlert 
          onResendVerification={onResendVerification} 
          isResending={resendingVerification} 
        />
      )}
      
      <LoginFormFields
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isLoading={isLoading}
        onSubmit={onSubmit}
        isEmailReadOnly={isEmailReadOnly}
      />
    </>
  );
};

export default LoginForm;
