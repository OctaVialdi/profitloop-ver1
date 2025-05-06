
import React from "react";
import { Link } from "react-router-dom";
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

interface JobDetailsProps {
  jobData: JobPreviewData;
}

export const JobDetails = ({ jobData }: JobDetailsProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-2xl w-full">
        <Card>
          <CardHeader className="relative">
            <div className="absolute right-6 top-6 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
              <EyeIcon className="h-3 w-3 mr-1" />
              Preview Mode
            </div>
            {jobData.organization.logo_url ? (
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
            <CardTitle className="text-2xl">{jobData.position.title}</CardTitle>
            <CardDescription className="text-base">
              {jobData.organization.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              {jobData.position.location && (
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

            {jobData.position.description && (
              <div>
                <h3 className="font-semibold mb-2">Job Description</h3>
                <div className="text-sm whitespace-pre-wrap">
                  {jobData.position.description}
                </div>
              </div>
            )}

            {jobData.position.requirements && (
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
              <Link to={`/apply/${jobData.token}`} className="flex items-center">
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
};
