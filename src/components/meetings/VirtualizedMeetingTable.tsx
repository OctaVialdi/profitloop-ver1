
import { FixedSizeList as List } from 'react-window';
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MeetingStatusBadge } from "./MeetingStatusBadge";
import { MeetingActionButton } from "./MeetingActionButton";
import { Edit, Trash2, History } from "lucide-react";
import { MeetingStatus, MeetingPoint } from "@/types/meetings";
import Spinner from "../Spinner";

interface VirtualizedMeetingTableProps {
  meetingPoints: MeetingPoint[];
  loading: boolean;
  updateCounts: Record<string, number>;
  onStatusChange: (meetingId: string, status: MeetingStatus) => void;
  onRequestByChange: (meetingId: string, requestBy: string) => void;
  onEditMeeting: (meeting: MeetingPoint) => void;
  onDeletePrompt: (meeting: MeetingPoint) => void;
  onAddUpdates: (meeting: MeetingPoint) => void;
  onNewPointChange: (value: string) => void;
  onNewPointKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  newPoint: string;
  requestByOptions: string[];
}

export const VirtualizedMeetingTable = ({
  meetingPoints,
  loading,
  updateCounts,
  onStatusChange,
  onRequestByChange,
  onEditMeeting,
  onDeletePrompt,
  onAddUpdates,
  onNewPointChange,
  onNewPointKeyDown,
  newPoint,
  requestByOptions
}: VirtualizedMeetingTableProps) => {
  const [windowHeight, setWindowHeight] = useState(0);
  const ROW_HEIGHT = 72; // Approximate height of each row in pixels
  const HEADER_HEIGHT = 56; // Height of the table header
  const currentDate = new Date().toLocaleDateString('en-US', { 
    day: 'numeric', 
    month: 'long',
    year: 'numeric'
  });

  // Update window dimensions on resize
  useEffect(() => {
    const updateWindowHeight = () => {
      setWindowHeight(window.innerHeight);
    };
    
    updateWindowHeight();
    window.addEventListener('resize', updateWindowHeight);
    
    return () => {
      window.removeEventListener('resize', updateWindowHeight);
    };
  }, []);

  // Calculate list height
  const listHeight = Math.min(
    windowHeight * 0.6, // 60% of window height
    meetingPoints.length * ROW_HEIGHT + ROW_HEIGHT + 50 // Total height of all rows + input row + some buffer
  );

  const TableHeader = () => (
    <div className="grid grid-cols-12 gap-4 py-3 px-4 font-medium text-sm text-muted-foreground border-b bg-white sticky top-0">
      <div className="col-span-2">DATE</div>
      <div className="col-span-4">DISCUSSION POINT</div>
      <div className="col-span-2">REQUEST BY</div>
      <div className="col-span-1">STATUS</div>
      <div className="col-span-1">UPDATES</div>
      <div className="col-span-2">ACTIONS</div>
    </div>
  );

  const Row = ({ index, style }: { index: number, style: React.CSSProperties }) => {
    if (index === meetingPoints.length) {
      // This is the input row
      return (
        <div style={style} className="grid grid-cols-12 gap-4 items-center py-2 px-4 border-t bg-white">
          <div className="col-span-2">{currentDate}</div>
          <div className="col-span-10">
            <input
              type="text"
              placeholder="Type a new discussion point and press Enter..."
              className="w-full py-2 focus:outline-none text-gray-500 italic"
              value={newPoint}
              onChange={(e) => onNewPointChange(e.target.value)}
              onKeyDown={onNewPointKeyDown}
            />
          </div>
        </div>
      );
    }

    const point = meetingPoints[index];
    return (
      <div 
        style={style} 
        className={`grid grid-cols-12 gap-4 items-center py-2 px-4 border-b ${
          index % 2 === 0 ? 'bg-white' : 'bg-[#f9fafb]'
        }`}
      >
        <div className="col-span-2">{point.date}</div>
        <div className="col-span-4 truncate" title={point.discussion_point}>
          {point.discussion_point}
        </div>
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
        <div className="col-span-1">
          <MeetingStatusBadge 
            status={point.status} 
            onChange={(value) => onStatusChange(point.id, value as MeetingStatus)} 
          />
        </div>
        <div className="col-span-1">
          <div 
            className="flex items-center gap-2 text-blue-500 hover:text-blue-700 cursor-pointer"
            onClick={() => onAddUpdates(point)}
          >
            <History size={16} />
            <span>{updateCounts[point.id] || 0}</span>
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
    );
  };

  if (loading) {
    return <Spinner centered size="lg" />;
  }

  if (meetingPoints.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow">
        <p>No meeting points found. Add one below.</p>
        <div className="mt-4 px-4 flex items-center">
          <div className="w-1/6">{currentDate}</div>
          <div className="w-5/6">
            <input
              type="text"
              placeholder="Type a new discussion point and press Enter..."
              className="w-full py-2 focus:outline-none text-gray-500 italic"
              value={newPoint}
              onChange={(e) => onNewPointChange(e.target.value)}
              onKeyDown={onNewPointKeyDown}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <TableHeader />
      <List
        height={listHeight}
        itemCount={meetingPoints.length + 1} // +1 for the input row
        itemSize={ROW_HEIGHT}
        width="100%"
        className="custom-scrollbar"
      >
        {Row}
      </List>
    </div>
  );
};
