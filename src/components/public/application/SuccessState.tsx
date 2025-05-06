
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkInfo } from "@/hooks/useApplicationForm";

interface SuccessStateProps {
  linkInfo: LinkInfo | null;
}

const SuccessState = ({ linkInfo }: SuccessStateProps) => {
  return (
    <div className="container max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl">Application Submitted Successfully!</CardTitle>
          <CardDescription className="text-lg">
            Thank you for applying to {linkInfo?.job_title} at {linkInfo?.organization_name}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <p className="mb-6 text-muted-foreground">
            We have received your application and will review it shortly. 
            You will be contacted if your qualifications match our requirements.
          </p>
          <Button 
            onClick={() => window.location.href = "https://app.profitloop.id"}
            className="min-w-[200px]"
          >
            Return to Homepage
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuccessState;
