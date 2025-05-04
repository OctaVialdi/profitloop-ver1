
import { Session, User } from "@supabase/supabase-js";

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  isLoading: boolean;
  loginError: string | null;
  session: Session | null;
  user: User | null;
}

export interface AuthSignInResult {
  data: {
    session?: Session | null;
    user?: User | null;
  } | null;
  error: Error | null;
}
