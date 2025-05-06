
import React from "react";

const InvalidLinkState = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-destructive mb-2">Invalid Application Link</h1>
      <p className="text-muted-foreground text-center max-w-md">
        The application link you are trying to access is invalid or has expired. 
        Please contact the recruiter for a new link.
      </p>
    </div>
  );
};

export default InvalidLinkState;
