
import { useEffect, useState } from "react";
import { createAssetImagesBucket } from "@/integrations/supabase/storage";
import { toast } from "sonner";

export function useAssetStorage() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function initializeStorage() {
      try {
        setIsLoading(true);
        const success = await createAssetImagesBucket();
        if (success) {
          setIsInitialized(true);
        } else {
          setError("Failed to initialize asset storage");
          toast.error("Failed to initialize asset storage");
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
