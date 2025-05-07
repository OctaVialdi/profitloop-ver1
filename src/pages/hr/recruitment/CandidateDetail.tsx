
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
      const data = await candidateService.fetchCandidateById(id);
      if (data) {
        setCandidate(data);
      } else {
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
        onStatusUpdated={fetchCandidate}
      />
    </div>
  );
};

export default CandidateDetailPage;
