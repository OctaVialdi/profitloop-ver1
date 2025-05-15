
import { toast } from "sonner";

/**
 * Standardized toast message function to handle different toast formats
 * for compatibility with various toast APIs across the application
 */
export function showToast(message: string | { title?: string; description?: string; variant?: 'default' | 'destructive' }) {
  if (typeof message === 'string') {
    return toast(message);
  }
  
  const { title, description, variant } = message;
  
  if (variant === 'destructive') {
    return toast.error(title || description || '', { 
      description: title ? description : undefined 
    });
  }
  
  return toast(title || '', { 
    description: title ? description : description || '' 
  });
}

export function showErrorToast(message: string | { title?: string; description?: string }) {
  if (typeof message === 'string') {
    return toast.error(message);
  }
  
  const { title, description } = message;
  return toast.error(title || '', { description });
}

export function showSuccessToast(message: string | { title?: string; description?: string }) {
  if (typeof message === 'string') {
    return toast.success(message);
  }
  
  const { title, description } = message;
  return toast.success(title || '', { description });
}
