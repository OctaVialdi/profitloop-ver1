
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { candidateService, CandidateWithDetails } from "@/services/candidateService";
import { CandidateDetailSidebar } from "@/components/hr/recruitment/candidate-detail/CandidateDetailSidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ensureEvaluationHasCriteriaScores } from "@/utils/evaluationUtils";

const CandidateDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<CandidateWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCandidate = useCallback(async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      console.log(`Fetching candidate details for ID: ${id}`);
      const data = await candidateService.fetchCandidateById(id);
      if (data) {
        console.log("Candidate data fetched successfully:", data);
        
        // Process evaluations to ensure they all have criteria_scores
        if (data.evaluations && data.evaluations.length > 0) {
          data.evaluations = data.evaluations.map(evaluation => 
            ensureEvaluationHasCriteriaScores(evaluation)
          );
        }
        
        setCandidate(data);
      } else {
        console.error("Candidate not found");
        toast.error("Candidate not found");
      }
    } catch (error) {
      console.error("Error fetching candidate:", error);
      toast.error("Failed to load candidate data");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCandidate();
  }, [fetchCandidate]);

  // Handler for refreshing data
  const handleDataRefresh = useCallback(() => {
    console.log("Refreshing candidate data...");
    fetchCandidate();
  }, [fetchCandidate]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Candidate not found</h2>
          <Button onClick={() => navigate("/hr/recruitment/candidates")}>
            Back to Candidates List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2" 
          onClick={() => navigate("/hr/recruitment/candidates")}
        >
          <ArrowLeft size={16} />
          <span>Back to Candidates List</span>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left sidebar with profile picture and navigation */}
        <CandidateDetailSidebar candidate={candidate} />

        {/* Main content area - render the nested route content */}
        <div className="flex-1">
          <Outlet context={{ candidate, onStatusUpdated: handleDataRefresh }} />
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailPage;
