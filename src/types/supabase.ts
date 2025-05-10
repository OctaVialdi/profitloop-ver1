
// Define Supabase JSON type
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Database error types
export interface DatabaseError {
  message: string;
  details: string;
  hint: string;
  code: string;
}

// Query error types
export interface QueryError {
  message: string;
  details: string;
  hint: string;
  code: string;
}

// Extend types as needed for your Supabase setup
