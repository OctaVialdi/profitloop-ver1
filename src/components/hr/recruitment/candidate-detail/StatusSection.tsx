import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CandidateWithDetails, candidateService } from "@/services/candidateService";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { 
  Badge, 
  BadgeProps
} from "@/components/ui/badge";
import { evaluationService, StatusOption } from "@/services/evaluationService";
import { StatusManager } from "./StatusManager";

interface StatusSectionProps {
  candidate: CandidateWithDetails;
  onStatusUpdated: () => void;
}

// Define all possible status values to ensure consistency
export const CANDIDATE_STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'screening', label: 'Screening' },
  { value: 'interview', label: 'Interview' },
  { value: 'assessment', label: 'Assessment' },
  { value: 'offered', label: 'Offered' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Rejected' }
];

export const StatusSection: React.FC<StatusSectionProps> = ({
  candidate,
  onStatusUpdated
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>(candidate.status);
  const [statusOptions, setStatusOptions] = useState<StatusOption[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  
  // Update selectedStatus when candidate.status changes
  useEffect(() => {
    setSelectedStatus(candidate.status);
  }, [candidate.status]);
  
  // Fetch status options from the database
  const fetchStatusOptions = async () => {
    setIsLoadingOptions(true);
    try {
      const options = await evaluationService.fetchCandidateStatusOptions();
      if (options && options.length > 0) {
        setStatusOptions(options);
      }
    } catch (error) {
      console.error("Error fetching status options:", error);
      // Keep default options if there's an error
    } finally {
      setIsLoadingOptions(false);
    }
  };
  
  // Fetch status options on component mount and when status is updated
  useEffect(() => {
    fetchStatusOptions();
  }, []);
  
  const getStatusBadgeProps = (status: string): BadgeProps => {
    switch (status) {
      case 'new':
        return { variant: 'default' };
      case 'screening':
        return { variant: 'outline' };
      case 'interview':
        return { className: 'bg-blue-100 text-blue-800 hover:bg-blue-200' };
      case 'assessment':
        return { className: 'bg-purple-100 text-purple-800 hover:bg-purple-200' };
      case 'offered':
        return { className: 'bg-amber-100 text-amber-800 hover:bg-amber-200' };
      case 'hired':
        return { className: 'bg-green-100 text-green-800 hover:bg-green-200' };
      case 'rejected':
        return { className: 'bg-red-100 text-red-800 hover:bg-red-200' };
      default:
        return { variant: 'secondary' };
    }
  };
  
  const handleUpdateStatus = async () => {
    if (selectedStatus === candidate.status) {
      toast.info("Status is unchanged");
      return;
    }
    
    setIsUpdating(true);
    try {
      // This call updates the status column in the candidate_applications table
      const result = await candidateService.updateCandidateStatus(candidate.id, selectedStatus);
      if (result) {
        const selectedOption = statusOptions.find(s => s.value === selectedStatus);
        toast.success(`Status updated to ${selectedOption?.label || selectedStatus}`);
        // Trigger the parent component to refresh data
        onStatusUpdated();
      } else {
        toast.error("Failed to update status");
        // Reset to previous status on failure
        setSelectedStatus(candidate.status);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("An error occurred while updating status");
      // Reset to previous status on error
      setSelectedStatus(candidate.status);
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <Card>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Application Status</h2>
          <StatusManager onStatusesChanged={fetchStatusOptions} />
        </div>
        
        <div className="border rounded-md p-4">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-2">Current Status</p>
              {candidate.status && (
                <Badge {...getStatusBadgeProps(candidate.status)}>
                  {statusOptions.find(s => s.value === candidate.status)?.label || 
                   candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                </Badge>
              )}
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-2">Update Status</p>
              <div className="flex items-center gap-2">
                <Select 
                  value={selectedStatus} 
                  onValueChange={setSelectedStatus}
                  disabled={isLoadingOptions}
                >
                  <SelectTrigger className="w-[180px]">
                    {isLoadingOptions ? (
                      <div className="flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>Loading...</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Select status" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button 
                  onClick={handleUpdateStatus} 
                  disabled={isUpdating || selectedStatus === candidate.status || isLoadingOptions}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Status"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
