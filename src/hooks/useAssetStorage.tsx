
import { useEffect, useState } from "react";
import { ensureBucketExists } from "@/integrations/supabase/storage";
import { toast } from "sonner";

export function useAssetStorage() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function initializeStorage() {
      try {
        setIsLoading(true);
        // Try to ensure the company_documents bucket exists
        const success = await ensureBucketExists('company_documents', true);
        
        if (success) {
          setIsInitialized(true);
        } else {
          setError("Failed to initialize asset storage");
          console.warn("Storage may be in limited functionality mode. Some features might not work as expected.");
        }
      } catch (err) {
        console.error("Error initializing asset storage:", err);
        setError("Error initializing asset storage");
        toast.error("Error initializing asset storage");
      } finally {
        setIsLoading(false);
      }
    }
    
    initializeStorage();
  }, []);
  
  return { isInitialized, isLoading, error };
}
