
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export function useJobPreviewData(linkToken: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobData, setJobData] = useState<any | null>(null);
  const [organizationData, setOrganizationData] = useState<any | null>(null);
  const [linkData, setLinkData] = useState<any | null>(null);
  
  useEffect(() => {
    if (!linkToken) {
      setError("No link token provided");
      setIsLoading(false);
      return;
    }

    const fetchJobData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // First get the link details
        const { data: linkData, error: linkError } = await supabase
          .from("recruitment_links")
          .select("*, job_position_id, organization_id")
          .eq("token", linkToken)
          .single();

        if (linkError) {
          throw new Error("Invalid or expired link");
        }

        if (linkData.status !== "active") {
          throw new Error("This invitation link is no longer active");
        }

        if (linkData.expires_at && new Date(linkData.expires_at) < new Date()) {
          throw new Error("This invitation link has expired");
        }

        setLinkData(linkData);

        // Fetch the job position
        if (linkData.job_position_id) {
          const { data: jobData, error: jobError } = await supabase
            .from("job_positions")
            .select("*")
            .eq("id", linkData.job_position_id)
            .single();

          if (jobError) {
            throw new Error("Error fetching job position data");
          }

          setJobData(jobData);
        }

        // Fetch the organization
        if (linkData.organization_id) {
          const { data: orgData, error: orgError } = await supabase
            .from("organizations")
            .select("*")
            .eq("id", linkData.organization_id)
            .single();

          if (orgError) {
            throw new Error("Error fetching organization data");
          }

          // Handle potentially missing name and logo_path properties
          setOrganizationData({
            ...orgData,
            name: orgData?.name || "Organization", 
            logo_path: orgData?.logo_path || null
          });
        }

        // Update clicks count
        const { error: updateError } = await supabase
          .from("recruitment_links")
          .update({ clicks: (linkData.clicks || 0) + 1 })
          .eq("id", linkData.id);

        if (updateError) {
          console.error("Failed to update click count:", updateError);
        }
      } catch (err: any) {
        console.error("Error fetching job data:", err);
        setError(err.message || "Failed to load job data");
        toast.error(err.message || "Failed to load job data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobData();
  }, [linkToken]);

  return {
    isLoading,
    error,
    jobData,
    organizationData,
    linkData,
  };
}
