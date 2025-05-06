
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const ApplicationSuccess = () => {
  return (
    <div className="container max-w-md mx-auto py-12 px-4">
      <Card className="border-green-100">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Application Submitted!</CardTitle>
          <CardDescription>Your job application has been successfully submitted.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Thank you for applying. We will review your application and contact you if your qualifications match our requirements.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline" onClick={() => window.close()}>Close Window</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ApplicationSuccess;
