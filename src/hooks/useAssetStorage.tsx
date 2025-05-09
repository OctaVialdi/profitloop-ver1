
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
        const result = await ensureBucketExists('company_documents', true);
        
        if (result.success) {
          setIsInitialized(true);
        } else {
          // If we failed due to permissions but the bucket likely exists
          if (result.error && (
            result.error.includes("already exists") || 
            result.error.includes("row-level security policy")
          )) {
            console.log("Storage bucket already exists, proceeding with limited permissions");
            setIsInitialized(true);
          } else {
            setError(result.error || "Failed to initialize asset storage");
            console.warn("Storage may be in limited functionality mode. Some features might not work as expected.");
          }
        }
      } catch (err: any) {
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
