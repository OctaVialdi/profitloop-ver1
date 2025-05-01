
import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VirtualizedMeetingTable } from "@/components/meetings/VirtualizedMeetingTable";
import { MeetingPoint, MeetingStatus, MeetingPointFilters } from "@/types/meetings";

interface MeetingTableSectionProps {
  meetingPoints: MeetingPoint[];
  loading: boolean;
  updateCounts: Record<string, number>;
  filters: MeetingPointFilters;
  requestByOptions: string[];
  newPoint: string;
  onFiltersChange: (filters: MeetingPointFilters) => void;
  onStatusChange: (meetingId: string, status: MeetingStatus) => void;
  onRequestByChange: (meetingId: string, requestBy: string) => void;
  onEditMeeting: (meeting: MeetingPoint) => void;
  onDeletePrompt: (meeting: MeetingPoint) => void;
  onAddUpdates: (meeting: MeetingPoint) => void;
  onNewPointChange: (value: string) => void;
  onNewPointKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const MeetingTableSection: React.FC<MeetingTableSectionProps> = ({
  meetingPoints,
  loading,
  updateCounts,
  filters,
  requestByOptions,
  newPoint,
  onFiltersChange,
  onStatusChange,
  onRequestByChange,
  onEditMeeting,
  onDeletePrompt,
  onAddUpdates,
  onNewPointChange,
  onNewPointKeyDown
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Meeting Points</h2>
        <div className="flex space-x-2">
          <Select
            value={filters.status}
            onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
          >
            <SelectTrigger className="w-[150px] bg-[#f5f5fa]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="not-started">Not Started</SelectItem>
              <SelectItem value="on-going">On Going</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="presented">Presented</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={filters.requestBy}
            onValueChange={(value) => onFiltersChange({ ...filters, requestBy: value })}
          >
            <SelectTrigger className="w-[150px] bg-[#f5f5fa]">
              <SelectValue placeholder="All Request By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Request By</SelectItem>
              {requestByOptions.map((person) => (
                <SelectItem key={person} value={person}>
                  {person}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={filters.timeRange}
            onValueChange={(value) => onFiltersChange({ ...filters, timeRange: value })}
          >
            <SelectTrigger className="w-[150px] bg-[#f5f5fa]">
              <SelectValue placeholder="All Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <VirtualizedMeetingTable
        meetingPoints={meetingPoints}
        loading={loading}
        updateCounts={updateCounts}
        onStatusChange={onStatusChange}
        onRequestByChange={onRequestByChange}
        onEditMeeting={onEditMeeting}
        onDeletePrompt={onDeletePrompt}
        onAddUpdates={onAddUpdates}
        onNewPointChange={onNewPointChange}
        onNewPointKeyDown={onNewPointKeyDown}
        newPoint={newPoint}
        requestByOptions={requestByOptions}
      />
    </div>
  );
};
