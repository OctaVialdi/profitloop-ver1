
import { useLoginForm as useLoginFormImplementation } from "./auth/useLoginForm";

// Export the hook directly to avoid circular dependencies
export const useLoginForm = useLoginFormImplementation;
