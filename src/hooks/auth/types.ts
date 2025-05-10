
import { Session, User } from '@supabase/supabase-js';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthSignInResult {
  data: {
    user: User | null;
    session: Session | null;
  } | null;
  error: Error | null;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}
