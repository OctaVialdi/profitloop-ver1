
import { toast } from "sonner";

/**
 * Standardized error handler for API operations
 * @param error The error object caught in the catch block
 * @param message User-friendly error message to display
 */
export const handleError = (error: any, message: string): void => {
  console.error(`${message}:`, error);
  
  // Display a toast with the error message
  toast.error(message, {
    description: error?.message || "An unexpected error occurred"
  });
};
