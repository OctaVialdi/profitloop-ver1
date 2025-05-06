
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPinIcon, CalendarIcon, BuildingIcon, ArrowRightIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface JobData {
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
  jobData: JobData;
}

export const JobDetails: React.FC<JobDetailsProps> = ({ jobData }) => {
  const navigate = useNavigate();
  
  const handleApplyNow = () => {
    // Navigate to the application form with the token
    navigate(`/apply/${jobData.token}`);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg">
          <CardHeader className="border-b bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6">
            <div className="flex items-center gap-4">
              {jobData.organization.logo_url ? (
                <img 
                  src={jobData.organization.logo_url} 
                  alt={jobData.organization.name} 
                  className="h-16 w-16 object-contain bg-white p-2 rounded-md"
                />
              ) : (
                <div className="h-16 w-16 flex items-center justify-center bg-primary/10 text-primary font-bold text-xl rounded-md">
                  {jobData.organization.name.charAt(0)}
                </div>
              )}
              
              <div>
                <h1 className="text-2xl font-bold">{jobData.position.title}</h1>
                <p className="text-gray-500 flex items-center gap-1">
                  <BuildingIcon className="h-4 w-4" />
                  {jobData.organization.name}
                </p>
              </div>
            </div>
            
            <Button 
              onClick={handleApplyNow}
              className="flex items-center gap-2"
            >
              Apply Now <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="py-6">
            <div className="flex flex-wrap gap-4 mb-6">
              {jobData.position.location && (
                <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                  <MapPinIcon className="h-4 w-4 text-gray-500" />
                  {jobData.position.location}
                </Badge>
              )}
              
              <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                <CalendarIcon className="h-4 w-4 text-gray-500" />
                Apply Now
              </Badge>
            </div>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Job Description</h2>
                <div className="prose prose-sm max-w-none">
                  {jobData.position.description ? (
                    <p className="whitespace-pre-line">{jobData.position.description}</p>
                  ) : (
                    <p className="text-gray-500 italic">No description provided</p>
                  )}
                </div>
              </div>
              
              {jobData.position.requirements && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">Requirements</h2>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-line">{jobData.position.requirements}</p>
                  </div>
                </div>
              )}
              
              <div className="pt-4">
                <Button 
                  onClick={handleApplyNow}
                  className="w-full sm:w-auto"
                >
                  Apply for this position
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
