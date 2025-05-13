
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MeetingSummaryCard } from "@/components/meetings/MeetingSummaryCard";
import { MeetingUpdateItem } from "@/components/meetings/MeetingUpdateItem";
import { AlertTriangle, Clock, CheckCircle, XCircle, Presentation, History } from "lucide-react";
import { MeetingSummaryStatus, MeetingUpdate } from "@/types/meetings";

interface MeetingSummarySectionProps {
  notStartedCount: number;
  onGoingCount: number;
  completedCount: number;
  rejectedCount: number;
  presentedCount: number;
  updatesCount: number;
  recentUpdates: MeetingUpdate[];
}

export function MeetingSummarySection({
  notStartedCount,
  onGoingCount,
  completedCount,
  rejectedCount,
  presentedCount,
  updatesCount,
  recentUpdates
}: MeetingSummarySectionProps) {
  return (
    <div className="w-full lg:w-1/4">
      <Card className="shadow-md border-gray-200 dark:border-gray-700 mb-6">
        <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="text-xl text-gray-800 dark:text-gray-100">Meeting Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-3">
            <MeetingSummaryCard status="not-started" count={notStartedCount} icon={AlertTriangle} label="Not Started" />
            <MeetingSummaryCard status="on-going" count={onGoingCount} icon={Clock} label="On Going" />
            <MeetingSummaryCard status="completed" count={completedCount} icon={CheckCircle} label="Completed" />
            <MeetingSummaryCard status="rejected" count={rejectedCount} icon={XCircle} label="Rejected" />
            <MeetingSummaryCard status="presented" count={presentedCount} icon={Presentation} label="Presented" />
            <MeetingSummaryCard status={"updates" as MeetingSummaryStatus} count={updatesCount} icon={History} label="Updates" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-md border-gray-200 dark:border-gray-700">
        <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="text-xl text-gray-800 dark:text-gray-100">Recent Updates</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ScrollArea className="h-[300px]">
            <div className="space-y-4 pr-4">
              {recentUpdates.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No recent updates.</p>
              ) : (
                recentUpdates.map(update => (
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
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
