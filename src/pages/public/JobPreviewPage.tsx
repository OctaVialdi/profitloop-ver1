
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useJobPreviewData } from "@/hooks/useJobPreviewData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Building, Calendar, Clock, MapPin } from "lucide-react";

export default function JobPreviewPage() {
  const { token } = useParams<{ token: string }>();
  const { isLoading, error, jobData, organizationData, linkData } = useJobPreviewData(
    token || ""
  );

  // Handle states for the application form
  const [viewType, setViewType] = useState<"preview" | "apply">("preview");
  const [isApplying, setIsApplying] = useState(false);

  // If token is not provided
  if (!token) {
    return (
      <div className="container mx-auto py-10 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">Invalid Job Link</h1>
        <p className="text-muted-foreground mb-6">
          The job invitation link appears to be invalid.
        </p>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl py-10">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />

            <div className="border-t border-b py-4 my-4">
              <Skeleton className="h-6 w-32 mb-3" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>

            <Skeleton className="h-10 w-40 mt-4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto py-10 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">Error Loading Job</h1>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  // If no job data found
  if (!jobData) {
    return (
      <div className="container mx-auto py-10 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The job you're looking for could not be found.
        </p>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  // The actual preview page
  return (
    <div className="container mx-auto max-w-3xl py-10">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">{jobData.title}</h1>
              <p className="text-muted-foreground">
                {organizationData?.name || "Company"}
              </p>
            </div>
            {organizationData?.logo_path && (
              <div className="w-16 h-16 flex-shrink-0">
                <img
                  src={organizationData.logo_path}
                  alt={`${organizationData.name} Logo`}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Job details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span>
                {jobData.department || "Various Departments"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{jobData.location || "Remote"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{jobData.employment_type || "Full-time"}</span>
            </div>
            {jobData.application_deadline && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Deadline: {new Date(jobData.application_deadline).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Job description */}
          <div className="prose prose-sm max-w-none">
            <h3 className="text-lg font-medium">Job Description</h3>
            <div
              dangerouslySetInnerHTML={{
                __html:
                  jobData.description ||
                  "<p>No detailed description provided.</p>",
              }}
            />
          </div>

          {/* Requirements */}
          {jobData.requirements && (
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-medium">Requirements</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: jobData.requirements,
                }}
              />
            </div>
          )}

          {/* Apply button */}
          <div className="pt-4 flex justify-center md:justify-start">
            <Button
              onClick={() => window.location.href = `/apply/${token}`}
              className="flex items-center gap-2"
            >
              Apply Now <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
