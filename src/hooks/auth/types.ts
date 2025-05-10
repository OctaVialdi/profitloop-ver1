
import { Session, User } from "@supabase/supabase-js";
import { UserProfile } from "@/types/organization";
import { Json } from "@/types/supabase";

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: Error | null;
}

export interface MagicLinkState {
  isLoading: boolean;
  error: Error | null;
  success: boolean;
  user: User | null;
}

export interface EmailVerificationState {
  message: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
}
