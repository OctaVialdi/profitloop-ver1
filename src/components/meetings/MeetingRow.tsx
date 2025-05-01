
import React from 'react';
import { MeetingPoint, MeetingStatus } from "@/types/meetings";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MeetingStatusBadge } from "./MeetingStatusBadge";
import { MeetingActionButton } from "./MeetingActionButton";
import { Edit, Trash2, History } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MeetingRowProps {
  point: MeetingPoint;
  requestByOptions: string[];
  onRequestByChange: (meetingId: string, requestBy: string) => void;
  onStatusChange: (meetingId: string, status: MeetingStatus) => void;
  onAddUpdates: (meeting: MeetingPoint) => void;
  onEditMeeting: (meeting: MeetingPoint) => void;
  onDeletePrompt: (meeting: MeetingPoint) => void;
  updateCount: number;
  isEven: boolean;
}

export const MeetingRow: React.FC<MeetingRowProps> = ({
  point,
  requestByOptions,
  onRequestByChange,
  onStatusChange,
  onAddUpdates,
  onEditMeeting,
  onDeletePrompt,
  updateCount,
  isEven
}) => {
  return (
    <TooltipProvider>
      <div 
        className={`grid grid-cols-12 gap-4 items-center py-2 px-4 border-b ${
          isEven ? 'bg-white' : 'bg-[#f9fafb]'
        }`}
      >
        <div className="col-span-2 pr-2 truncate" title={point.date}>
          {point.date}
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="col-span-3 line-clamp-2 break-words hover:cursor-help">
              {point.discussion_point}
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-md p-2">
            <p className="break-words">{point.discussion_point}</p>
          </TooltipContent>
        </Tooltip>
        <div className="col-span-2">
          <Select 
            defaultValue={point.request_by || "unassigned"} 
            onValueChange={(value) => onRequestByChange(point.id, value)}
          >
            <SelectTrigger className="w-[120px] bg-[#f5f5fa]">
              <SelectValue placeholder="Select person" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Select person</SelectItem>
              {requestByOptions.map((person) => (
                <SelectItem key={person} value={person}>
                  {person}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2">
          <MeetingStatusBadge 
            status={point.status} 
            onChange={(value) => onStatusChange(point.id, value as MeetingStatus)} 
          />
        </div>
        <div className="col-span-1">
          <div 
            className="flex items-center gap-1 text-blue-500 hover:text-blue-700 cursor-pointer"
            onClick={() => onAddUpdates(point)}
          >
            <History size={16} />
            <span>{updateCount || 0}</span>
          </div>
        </div>
        <div className="col-span-2">
          <div className="flex space-x-2">
            <MeetingActionButton 
              icon={Edit} 
              label="Edit" 
              onClick={() => onEditMeeting(point)} 
            />
            <MeetingActionButton 
              icon={Trash2} 
              label="Delete" 
              variant="destructive" 
              onClick={() => onDeletePrompt(point)} 
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
