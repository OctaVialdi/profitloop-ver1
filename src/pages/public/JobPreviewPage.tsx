
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EyeIcon, ArrowRightIcon, BuildingIcon, CalendarIcon, BriefcaseIcon } from "lucide-react";

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

export default function JobPreviewPage() {
  const { token } = useParams();
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
        // Use a direct update instead of RPC
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

        // Fix: Properly handle the organization data error case
        if (orgError || !orgData) {
          // Create default organization data with the correct shape
          const defaultOrgData = {
            name: "Organization",
            logo_url: null
          };
          
          setJobData({
            position: positionData,
            organization: defaultOrgData,
            token: token
          });
        } else {
          setJobData({
            position: positionData,
            organization: orgData,
            token: token
          });
        }
        
      } catch (err: any) {
        console.error("Error fetching job data:", err);
        setError(err.message || "An error occurred while loading the job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-200 h-12 w-12"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
          <p className="mt-4 text-gray-500">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600">Link Error</CardTitle>
            <CardDescription>
              We encountered a problem with this invitation link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <p className="mt-4 text-sm text-gray-500">
              This link may have expired or been disabled. Please contact the organization that shared this link with you.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-2xl w-full">
        <Card>
          <CardHeader className="relative">
            <div className="absolute right-6 top-6 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
              <EyeIcon className="h-3 w-3 mr-1" />
              Preview Mode
            </div>
            {jobData?.organization.logo_url ? (
              <div className="w-16 h-16 mb-4 bg-white rounded-md p-1 flex items-center justify-center">
                <img 
                  src={jobData.organization.logo_url} 
                  alt={`${jobData.organization.name} logo`}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : (
              <div className="w-16 h-16 mb-4 bg-primary/10 text-primary rounded-md flex items-center justify-center">
                <BuildingIcon className="h-8 w-8" />
              </div>
            )}
            <CardTitle className="text-2xl">{jobData?.position.title}</CardTitle>
            <CardDescription className="text-base">
              {jobData?.organization.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              {jobData?.position.location && (
                <div className="flex items-center">
                  <BuildingIcon className="h-4 w-4 mr-1" />
                  <span>{jobData.position.location}</span>
                </div>
              )}
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>Posted recently</span>
              </div>
              <div className="flex items-center">
                <BriefcaseIcon className="h-4 w-4 mr-1" />
                <span>Full Time</span>
              </div>
            </div>

            <Separator />

            {jobData?.position.description && (
              <div>
                <h3 className="font-semibold mb-2">Job Description</h3>
                <div className="text-sm whitespace-pre-wrap">
                  {jobData.position.description}
                </div>
              </div>
            )}

            {jobData?.position.requirements && (
              <div>
                <h3 className="font-semibold mb-2">Requirements</h3>
                <div className="text-sm whitespace-pre-wrap">
                  {jobData.position.requirements}
                </div>
              </div>
            )}

            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-sm">
              <h3 className="font-semibold text-amber-800 mb-2">
                This is a preview of the job position
              </h3>
              <p className="text-amber-700">
                To submit an application for this position, click the Apply Now button below.
                You'll be directed to our application form where you can provide your details and resume.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">
              Back
            </Button>
            <Button asChild>
              <Link to={`/apply/${jobData?.token}`} className="flex items-center">
                Apply Now <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <div className="text-center mt-6 text-sm text-gray-500">
          Powered by Profitloop Recruitment
        </div>
      </div>
    </div>
  );
}
