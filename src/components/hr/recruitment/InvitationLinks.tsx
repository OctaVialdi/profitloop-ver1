
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LinkIcon, PlusIcon, RotateCw } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import {
  InvitationLinksList,
  InvitationInfoCard,
  GenerateLinkDialog,
  useInvitationLinks,
} from "./invitation-links";

export default function InvitationLinks() {
  // Get search params to check if we're being directed here with a job ID
  const [searchParams] = useSearchParams();
  const jobIdFromParams = searchParams.get("jobId");

  const {
    invitationLinks,
    jobPositions,
    isRefreshing,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
    fetchInvitationLinks,
    handleGenerateLink
  } = useInvitationLinks();

  // Open the dialog automatically if a jobId is provided in the URL
  useEffect(() => {
    if (jobIdFromParams) {
      setIsDialogOpen(true);
    }
  }, [jobIdFromParams]);
  
  // Handle generate link with selected position and expiration period
  const handleGenerateLinkSubmit = async (selectedPosition: string, expirationPeriod: string) => {
    await handleGenerateLink(selectedPosition, expirationPeriod);
    
    // Clear the jobId from URL if it exists
    if (jobIdFromParams) {
      // Remove the jobId parameter from the URL without reloading the page
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("jobId");
      window.history.replaceState(
        {},
        "",
        window.location.pathname + (newSearchParams.toString() ? `?${newSearchParams.toString()}` : "")
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <LinkIcon className="h-5 w-5" />
          Invitation Links
        </h2>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchInvitationLinks}
            disabled={isRefreshing}
            className="flex items-center gap-1"
          >
            <RotateCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          
          <Button 
            className="flex items-center gap-1" 
            onClick={() => setIsDialogOpen(true)}
          >
            <PlusIcon className="h-4 w-4" />
            <span>Generate Link</span>
          </Button>
        </div>
      </div>
      
      <InvitationInfoCard />
      
      <InvitationLinksList
        invitationLinks={invitationLinks}
        isRefreshing={isRefreshing}
        onRefresh={fetchInvitationLinks}
        onGenerateLink={() => setIsDialogOpen(true)}
      />
      
      <GenerateLinkDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onGenerateLink={handleGenerateLinkSubmit}
        isLoading={isLoading}
        jobPositions={jobPositions}
        defaultPositionId={jobIdFromParams || ""}
      />
    </div>
  );
}
