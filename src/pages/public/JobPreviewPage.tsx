
import React from "react";
import { useParams } from "react-router-dom";
import { useJobPreviewData } from "@/hooks/useJobPreviewData";
import { LoadingState } from "@/components/public/job-preview/LoadingState";
import { ErrorState } from "@/components/public/job-preview/ErrorState";
import { JobDetails } from "@/components/public/job-preview/JobDetails";

export default function JobPreviewPage() {
  // Get the token from the URL parameters
  const { token } = useParams<{ token: string }>();

  console.log("JobPreviewPage: Token from URL:", token);
  
  // Use our custom hook to fetch job data
  const { isLoading, error, jobData } = useJobPreviewData(token || '');
  
  console.log("JobPreviewPage: Job data loading status:", isLoading);
  console.log("JobPreviewPage: Job data:", jobData);
  
  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !jobData) {
    return <ErrorState error={error?.message || "Invalid invitation link"} />;
  }

  return <JobDetails jobData={jobData} />;
}
