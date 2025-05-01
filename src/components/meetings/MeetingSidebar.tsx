
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MeetingSummaryCard } from "@/components/meetings/MeetingSummaryCard";
import { MeetingUpdateItem } from "@/components/meetings/MeetingUpdateItem";
import { AlertTriangle, Clock, CheckCircle, XCircle, Presentation, History } from "lucide-react";
import { MeetingSummaryStatus, MeetingUpdate } from "@/types/meetings";

interface MeetingSidebarProps {
  notStartedCount: number;
  onGoingCount: number;
  completedCount: number;
  rejectedCount: number;
  presentedCount: number;
  updatesCount: number;
  recentUpdates: MeetingUpdate[];
}

export const MeetingSidebar: React.FC<MeetingSidebarProps> = ({ 
  notStartedCount,
  onGoingCount,
  completedCount,
  rejectedCount,
  presentedCount,
  updatesCount,
  recentUpdates
}) => {
  return (
    <div className="w-1/4 bg-white p-6 border-l">
      <h2 className="text-xl font-semibold mb-6">Meeting Summary</h2>
      
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
      
      <h3 className="text-lg font-medium mb-4">Recent Updates</h3>
      <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
        {recentUpdates.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent updates.</p>
        ) : (
          recentUpdates.map((update) => (
            <MeetingUpdateItem
              key={update.id}
              title={update.title}
              status={update.status}
              person={update.person}
              date={update.date}
            />
          ))
        )}
      </div>
    </div>
  );
};
