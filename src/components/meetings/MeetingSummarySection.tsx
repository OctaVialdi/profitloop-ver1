
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MeetingSummaryCard } from "@/components/meetings/MeetingSummaryCard";
import { AlertTriangle, Clock, CheckCircle, XCircle, Presentation, History } from "lucide-react";
import { MeetingSummaryStatus } from "@/types/meetings";

interface MeetingSummarySectionProps {
  notStartedCount: number;
  onGoingCount: number;
  completedCount: number;
  rejectedCount: number;
  presentedCount: number;
  updatesCount: number;
}

export const MeetingSummarySection: React.FC<MeetingSummarySectionProps> = ({
  notStartedCount,
  onGoingCount,
  completedCount,
  rejectedCount,
  presentedCount,
  updatesCount
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Today's Points</h3>
        <div className="grid grid-cols-2 gap-4">
          <MeetingSummaryCard 
            status="not-started" 
            count={notStartedCount} 
            icon={AlertTriangle} 
            label="Not Started" 
          />
          <MeetingSummaryCard 
            status="on-going" 
            count={onGoingCount} 
            icon={Clock} 
            label="On Going" 
          />
          <MeetingSummaryCard 
            status="completed" 
            count={completedCount} 
            icon={CheckCircle} 
            label="Completed" 
          />
          <MeetingSummaryCard 
            status="rejected" 
            count={rejectedCount} 
            icon={XCircle} 
            label="Rejected" 
          />
          <MeetingSummaryCard 
            status="presented" 
            count={presentedCount} 
            icon={Presentation} 
            label="Presented" 
          />
          <MeetingSummaryCard 
            status={"updates" as MeetingSummaryStatus} 
            count={updatesCount} 
            icon={History} 
            label="Updates" 
          />
        </div>
      </CardContent>
    </Card>
  );
};
