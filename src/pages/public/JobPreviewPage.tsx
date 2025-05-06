
import React from "react";
import { useParams } from "react-router-dom";
import { useJobPreviewData } from "@/hooks/useJobPreviewData";
import { LoadingState } from "@/components/public/job-preview/LoadingState";
import { ErrorState } from "@/components/public/job-preview/ErrorState";
import { JobDetails } from "@/components/public/job-preview/JobDetails";

export default function JobPreviewPage() {
  const { token } = useParams();
  const { loading, error, jobData } = useJobPreviewData(token);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!jobData) {
    return <ErrorState error="Could not load job details" />;
  }

  return <JobDetails jobData={jobData} />;
}
