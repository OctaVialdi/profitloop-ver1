
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface ErrorStateProps {
  error: string;
}

export const ErrorState = ({ error }: ErrorStateProps) => {
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
};
