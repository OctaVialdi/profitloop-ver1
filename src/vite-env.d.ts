
/// <reference types="vite/client" />

// Add sonner toast types
import { ExternalToast } from 'sonner';

declare module 'sonner' {
  // Extend ExternalToast type to support variant property for backward compatibility
  interface ExternalToast {
    variant?: 'default' | 'destructive';
  }
}
