
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useJobPreviewData(token: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [jobTitle, setJobTitle] = useState<string | null>(null);
  const [organizationName, setOrganizationName] = useState<string | null>(null);
  const [organizationLogo, setOrganizationLogo] = useState<string | null>(null);
  const [jobData, setJobData] = useState<any | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchJobInfo = async () => {
      if (!token) {
        setIsLoading(false);
        setIsValid(false);
        return;
      }

      try {
        setIsLoading(true);

        // Get link information from the database function
        const { data: linkInfo, error: linkError } = await supabase.rpc(
          "get_recruitment_link_info",
          { p_token: token }
        );

        if (linkError || !linkInfo || linkInfo.length === 0) {
          console.error("Error fetching recruitment link info:", linkError);
          setError(new Error("Invalid or expired link"));
          setIsValid(false);
          setIsLoading(false);
          return;
        }

        const linkData = linkInfo[0];
        
        // Check if link is valid
        if (!linkData.is_valid) {
          setIsValid(false);
          setError(new Error("This link has expired or is no longer active"));
          setIsLoading(false);
          return;
        }

        setOrganizationId(linkData.organization_id);
        setOrganizationName(linkData.organization_name || null);
        
        // If we have a job position, fetch its details
        if (linkData.job_position_id) {
          setJobId(linkData.job_position_id);
          setJobTitle(linkData.job_title || "Position");

          const { data: jobData, error: jobError } = await supabase
            .from("job_positions")
            .select("*")
            .eq("id", linkData.job_position_id)
            .single();

          if (jobError) {
            console.error("Error fetching job details:", jobError);
          } else {
            setJobData(jobData);
          }
        } else {
          // For general application links
          setJobId(null);
          setJobTitle(linkData.job_title || "General Application");
        }

        // Get organization logo if available
        try {
          const { data: orgData, error: orgError } = await supabase
            .from("organizations")
            .select("name, logo_path")
            .eq("id", linkData.organization_id)
            .single();

          if (!orgError && orgData) {
            if (orgData.name) setOrganizationName(orgData.name);
            if (orgData.logo_path) setOrganizationLogo(orgData.logo_path);
          }
        } catch (orgErr) {
          console.error("Error fetching organization details:", orgErr);
        }

        setIsValid(true);
      } catch (err: any) {
        console.error("Error in useJobPreviewData:", err);
        setError(err);
        toast.error("Error loading job information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobInfo();
  }, [token]);

  return {
    isLoading,
    isValid,
    jobTitle,
    organizationName,
    organizationLogo,
    jobData,
    organizationId,
    jobId,
    error,
  };
}
