
// Global TypeScript definitions
interface Window {
  snap?: {
    pay: (
      token: string, 
      options: {
        onSuccess: () => void;
        onPending: () => void;
        onError: (error: any) => void;
        onClose: () => void;
      }
    ) => void;
  }
}
