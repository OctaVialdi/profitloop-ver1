
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface JobPreviewData {
  position: {
    title: string;
    description: string | null;
    requirements: string | null;
    location: string | null;
  };
  organization: {
    name: string;
    logo_url: string | null;
  };
  token: string;
}

export const useJobPreviewData = (token: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobData, setJobData] = useState<JobPreviewData | null>(null);

  useEffect(() => {
    const fetchJobData = async () => {
      if (!token) {
        setError("Invalid link");
        setLoading(false);
        return;
      }

      try {
        // First, get the recruitment link data
        const { data: linkData, error: linkError } = await supabase
          .from("recruitment_links")
          .select(`
            id,
            token,
            job_position_id,
            organization_id,
            clicks
          `)
          .eq("token", token)
          .eq("status", "active")
          .single();

        if (linkError || !linkData) {
          throw new Error("Invalid or expired invitation link");
        }

        // Record the click on the link
        await supabase
          .from("recruitment_links")
          .update({ clicks: linkData.clicks ? linkData.clicks + 1 : 1 })
          .eq("id", linkData.id);

        // Get position details
        const { data: positionData, error: positionError } = await supabase
          .from("job_positions")
          .select("title, description, requirements, location")
          .eq("id", linkData.job_position_id)
          .single();

        if (positionError || !positionData) {
          throw new Error("Position not found");
        }

        // Get organization details
        const { data: orgData, error: orgError } = await supabase
          .from("organizations")
          .select("name, logo_url")
          .eq("id", linkData.organization_id)
          .single();

        // Handle organization data error case with default values
        const organizationData = orgError || !orgData 
          ? { name: "Organization", logo_url: null }
          : orgData;

        // Set job data with complete, valid structure
        setJobData({
          position: positionData,
          organization: organizationData,
          token: token
        });
      } catch (err: any) {
        console.error("Error fetching job data:", err);
        setError(err.message || "An error occurred while loading the job details");
        // Do NOT set jobData here as we don't have complete data
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [token]);

  return { loading, error, jobData };
};
