
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { candidateService, CandidateWithDetails } from "@/services/candidateService";
import { CandidateDetail as CandidateDetailComponent } from "@/components/hr/recruitment/candidate-detail/CandidateDetail";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

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
        
        // Ensure evaluations are processed correctly
        if (data.evaluations) {
          data.evaluations = data.evaluations.map(evaluation => {
            // Make sure criteria_scores is in the right format
            if (evaluation.criteria_scores && 
                typeof evaluation.criteria_scores === 'object' && 
                !Array.isArray(evaluation.criteria_scores)) {
              // If it's an object but not an array, it might be a JSON structure
              console.log("Converting evaluation criteria_scores from object to array");
              try {
                // Try to convert from object representation to array if needed
                const criteriaArray = Object.values(evaluation.criteria_scores);
                if (Array.isArray(criteriaArray)) {
                  evaluation.criteria_scores = criteriaArray;
                }
              } catch (err) {
                console.error("Error processing criteria_scores:", err);
                evaluation.criteria_scores = [];
              }
            } else if (!evaluation.criteria_scores) {
              evaluation.criteria_scores = [];
            }
            
            return evaluation;
          });
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
          <Button onClick={() => navigate("/hr/recruitment?tab=candidates")}>
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
          onClick={() => navigate("/hr/recruitment?tab=candidates")}
        >
          <ArrowLeft size={16} />
          <span>Back to Candidates List</span>
        </Button>
      </div>

      <CandidateDetailComponent 
        candidate={candidate}
        onStatusUpdated={handleDataRefresh}
      />
    </div>
  );
};

export default CandidateDetailPage;
